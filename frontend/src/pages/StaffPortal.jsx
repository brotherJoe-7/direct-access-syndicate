import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { CalendarCheck, Edit3, MessageSquareText, BookUp, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatDate';

const StaffPortal = () => {
    const { user } = useAuth();
    
    const actions = [
        {
            title: 'Mark Attendance',
            desc: 'Record daily presence and absences for students.',
            path: '/admin/attendance',
            icon: CalendarCheck,
            color: 'bg-emerald-50 text-emerald-600',
            border: 'border-emerald-100',
            hover: 'hover:border-emerald-300 hover:shadow-emerald-200/50'
        },
        {
            title: 'Publish Grades',
            desc: 'Enter scores, remarks, and generate terminal reports.',
            path: '/admin/grades',
            icon: Edit3,
            color: 'bg-blue-50 text-blue-600',
            border: 'border-blue-100',
            hover: 'hover:border-blue-300 hover:shadow-blue-200/50'
        },
        {
            title: 'Issue Feedback',
            desc: 'Write performance comments and credibility scores.',
            path: '/admin/reports',
            icon: MessageSquareText,
            color: 'bg-purple-50 text-purple-600',
            border: 'border-purple-100',
            hover: 'hover:border-purple-300 hover:shadow-purple-200/50'
        },
        {
            title: 'Upload Learning Material',
            desc: 'Add documents, videos, and links to the Learning Hub.',
            path: '/admin/learning',
            icon: BookUp,
            color: 'bg-amber-50 text-amber-600',
            border: 'border-amber-100',
            hover: 'hover:border-amber-300 hover:shadow-amber-200/50'
        }
    ];

    return (
        <Layout>
            <div className="max-w-5xl mx-auto">
                <div className="bg-slate-900 rounded-3xl p-8 md:p-12 mb-8 text-white relative overflow-hidden shadow-2xl shadow-slate-900/20">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 transform -translate-x-1/2 translate-y-1/2"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <p className="text-green-400 font-bold uppercase tracking-widest text-sm mb-2">Staff Portal</p>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Welcome back, {user?.name?.split(' ')[0] || 'Teacher'}</h1>
                            <p className="text-slate-300 text-lg max-w-xl leading-relaxed">Access your daily operational tools from this centralized dashboard. Manage attendance, grades, and parent communications efficiently.</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 w-max">
                            <p className="text-slate-300 text-xs font-bold uppercase tracking-widest mb-1">Today's Date</p>
                            <p className="text-white text-lg font-black">{formatDate(new Date())}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {actions.map((action, idx) => {
                        const Icon = action.icon;
                        return (
                            <Link 
                                key={idx} 
                                to={action.path}
                                className={`bg-white rounded-3xl p-8 border ${action.border} shadow-sm transition-all duration-300 ${action.hover} group hover:-translate-y-1 relative overflow-hidden`}
                            >
                                <div className={`w-14 h-14 rounded-2xl ${action.color} flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                                    <Icon size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">{action.title}</h3>
                                <p className="text-slate-500 font-medium mb-6">{action.desc}</p>
                                
                                <div className="flex items-center gap-2 text-sm font-bold text-slate-400 group-hover:text-slate-800 transition-colors">
                                    Access Tool <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </Layout>
    );
};

export default StaffPortal;
