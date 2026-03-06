import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { DollarSign, WalletCards, ArrowUpRight, TrendingUp, Activity, Users, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, amount, icon, isCurrency = true, trend, subtitle, colorClass }) => {
  const IconComponent = icon;
  return (
  <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-100/60 hover:shadow-xl hover:shadow-slate-200/50 transition-all relative overflow-hidden group">
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 blur-2xl transition-transform group-hover:scale-150 ${colorClass}`}></div>
    <div className="flex items-start justify-between relative z-10">
      <div>
        <p className="text-[13px] font-black tracking-widest text-slate-400 uppercase mb-2">{title}</p>
        <h3 className="text-4xl font-black text-slate-800 tracking-tight">
          {isCurrency && <span className="text-slate-300 text-2xl font-bold mr-1">SLL</span>}
          {typeof amount === 'number' && isCurrency ? amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : amount}
        </h3>
        {subtitle && <p className="text-sm font-medium text-slate-500 mt-1">{subtitle}</p>}
      </div>
      <div className={`p-4 rounded-2xl group-hover:-translate-y-1 transition-transform shadow-lg ${colorClass}`}>
        <IconComponent size={28} className="text-white" strokeWidth={2.5} />
      </div>
    </div>
    {trend && (
      <div className="mt-6 flex items-center gap-1.5 text-sm font-bold text-emerald-600 bg-emerald-50/80 w-max px-3 py-1.5 rounded-lg border border-emerald-100">
        <TrendingUp size={16} />
        {trend}
      </div>
    )}
  </div>
)};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await api.get('/dashboard');
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return (
      <Layout>
          <div className="flex h-[80vh] items-center justify-center flex-col gap-4">
              <div className="w-12 h-12 border-4 border-green-600/20 border-t-green-600 rounded-full animate-spin"></div>
              <p className="text-slate-500 font-medium animate-pulse">Loading DAS Intelligence...</p>
          </div>
      </Layout>
  );

  if (!stats) return <Layout><div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 font-medium">System Error: Failed to load intelligence data.</div></Layout>;

  return (
    <Layout>
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">Executive Overview</h1>
          <p className="text-slate-500 font-medium">Real-time financial and operational intelligence for DAS.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-full border border-slate-200 shadow-sm">
            <Clock size={16} className="text-green-600" />
            <span className="text-sm font-bold text-slate-700">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Premium KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard 
            title="Total Revenue" 
            amount={stats.totalIncome} 
            icon={DollarSign} 
            trend="+12.5% vs last month"
            colorClass="bg-gradient-to-br from-green-500 to-emerald-600" 
        />
        <StatCard 
            title="Operational Expenses" 
            amount={stats.totalExpenses} 
            icon={WalletCards} 
            trend="-2.1% optimized"
            colorClass="bg-gradient-to-br from-rose-500 to-red-600" 
        />
        <StatCard 
            title="Net Capital Margin" 
            amount={stats.totalSavings} 
            icon={ArrowUpRight} 
            trend="Healthy trajectory"
            colorClass="bg-gradient-to-br from-blue-500 to-indigo-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Income Breakdown Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-slate-100/60 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-600"></div>
          <div className="flex items-center justify-between mb-8">
            <div>
                <h2 className="text-xl font-bold text-slate-800">Revenue by Class Level</h2>
                <p className="text-sm text-slate-500 font-medium mt-1">Distribution of payments across operational grades</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-4 text-xs font-black text-slate-400 uppercase tracking-widest">Class Level</th>
                  <th className="pb-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Total Income Generated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {stats.monthlyByLevel?.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-5">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center font-bold text-sm">
                                {item.level.charAt(0)}
                            </div>
                            <span className="text-slate-700 font-bold">{item.level}</span>
                        </div>
                    </td>
                    <td className="py-5 text-right font-black text-slate-900 text-lg">
                      {Number(item.total).toLocaleString(undefined, { minimumFractionDigits: 0 })} <span className="text-slate-400 text-sm ml-1 select-none">SLL</span>
                    </td>
                  </tr>
                ))}
                {(!stats.monthlyByLevel || stats.monthlyByLevel.length === 0) && (
                  <tr><td colSpan="2" className="py-12 text-center text-slate-500 font-medium">No revenue data currently available in the system.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Logs & Quick Actions */}
        <div className="space-y-8">
            {/* Quick Link Card */}
            <Link to="/admin/students" className="block bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 shadow-xl hover:-translate-y-1 transition-transform group relative overflow-hidden">
                <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform"><Users size={120} /></div>
                <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm text-white">
                        <Users size={24} />
                    </div>
                    <div>
                        <h3 className="text-white text-xl font-bold mb-1">Student Database</h3>
                        <p className="text-slate-400 text-sm font-medium mb-4">Manage enrollments, profiles, and attendance records.</p>
                        <div className="flex items-center gap-2 text-green-400 font-bold text-sm group-hover:gap-3 transition-all">
                            Access Directory <ArrowRight size={16} />
                        </div>
                    </div>
                </div>
            </Link>

            {/* Audit Log Feed */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100/60">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                        <Activity size={20} />
                    </div>
                    <h2 className="text-lg font-bold text-slate-800">System Audit Log</h2>
                </div>
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                    {stats.activityLogs?.map((log, idx) => (
                    <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full border border-white bg-slate-200 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm ml-4 md:ml-0 md:group-even:pr-6 md:group-even:text-right md:group-odd:pl-6 md:group-odd:text-left">
                            <p className="text-sm font-bold text-slate-800 capitalize mb-1">{log.action.replace(/_/g, ' ')}</p>
                            <p className="text-xs text-slate-500 mb-2 leading-relaxed">{log.details}</p>
                            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">
                                {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                        </div>
                    </div>
                    ))}
                    {(!stats.activityLogs || stats.activityLogs.length === 0) && (
                    <p className="text-sm font-medium text-slate-500 text-center py-4 relative z-10 bg-white">No recent audit trails.</p>
                    )}
                </div>
            </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
