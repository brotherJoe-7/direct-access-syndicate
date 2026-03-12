import React, { useEffect, useRef } from 'react';
import { Phone, PhoneOff, Video, X } from 'lucide-react';
import { useCall } from '../context/CallContext';
import { useNavigate } from 'react-router-dom';

const IncomingCall = () => {
  const { activeCall, ignoreCall } = useCall();
  const navigate = useNavigate();
  const audioRef = useRef(null);

  useEffect(() => {
    if (activeCall) {
      // Play ringing sound
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.error("Audio playback failed", e));
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [activeCall]);

  if (!activeCall) return null;

  const handleAccept = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    navigate(`/video-call/${activeCall.room_name}`);
  };

  const handleDecline = () => {
    ignoreCall(activeCall.id);
  };

  return (
    <div className="fixed inset-x-0 top-6 z-[9999] flex justify-center px-4 animate-slide-down">
      <audio 
        ref={audioRef} 
        src="https://assets.mixkit.co/active_storage/sfx/1359/1359-preview.mp3" 
        loop 
      />
      <div className="w-full max-w-sm bg-slate-900 text-white rounded-3xl shadow-2xl border border-white/10 overflow-hidden backdrop-blur-xl bg-opacity-95">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg animate-pulse">
              {activeCall.call_type === 'video' ? <Video size={32} /> : <Phone size={32} />}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{activeCall.caller_name}</h3>
              <p className="text-blue-400 text-sm font-medium uppercase tracking-wider">{activeCall.caller_role}</p>
              <p className="text-slate-400 text-xs mt-1 italic">Incoming {activeCall.call_type} call...</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={handleDecline}
              className="flex-1 py-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl flex items-center justify-center gap-2 transition-all font-bold group"
            >
              <div className="w-10 h-10 rounded-full bg-red-500/20 group-hover:bg-white/20 flex items-center justify-center">
                <PhoneOff size={20} />
              </div>
              Decline
            </button>
            <button 
              onClick={handleAccept}
              className="flex-1 py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl flex items-center justify-center gap-2 transition-all font-bold shadow-lg shadow-green-500/20 active:scale-95"
            >
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Phone size={20} />
              </div>
              Accept
            </button>
          </div>
        </div>
        
        <div className="bg-white/5 py-2 px-6 flex justify-between items-center border-t border-white/5">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Sierra Leone Direct Access</span>
            <button onClick={handleDecline} className="text-slate-500 hover:text-white transition-colors">
                <X size={14} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCall;
