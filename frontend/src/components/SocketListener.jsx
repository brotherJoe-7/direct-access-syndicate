import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { Bell, X } from 'lucide-react';

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const SocketListener = () => {
    const { user, role } = useAuth();
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        if (!user || role !== 'parent') return;

        const socket = io(SOCKET_URL);

        socket.on('connect', () => {
            console.log('Connected to socket server');
            socket.emit('join_parent_room', user.id);
        });

        socket.on('new_notification', (data) => {
            console.log('New notification received:', data);
            setNotification(data);
            
            // Auto hide after 10 seconds
            setTimeout(() => setNotification(null), 10000);
        });

        return () => socket.disconnect();
    }, [user, role]);

    if (!notification) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[999] animate-in slide-in-from-right duration-500">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-5 max-w-sm flex gap-4 ring-4 ring-green-500/10">
                <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                    <Bell size={24} className="animate-bounce" />
                </div>
                <div className="flex-1">
                    <h4 className="font-black text-slate-800 text-sm">{notification.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{notification.message}</p>
                    <button 
                        onClick={() => setNotification(null)}
                        className="mt-3 text-xs font-bold text-green-600 hover:text-green-700"
                    >
                        View Details
                    </button>
                </div>
                <button 
                    onClick={() => setNotification(null)}
                    className="p-1 hover:bg-slate-100 rounded-full h-fit text-slate-400"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};

export default SocketListener;
