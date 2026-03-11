import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, Users, Calendar, Banknote, LogOut, FileText, Settings, User, Menu, X, BookOpen } from 'lucide-react';

const SidebarItem = ({ to, icon, label }) => {
  const IconComponent = icon;
  return (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium whitespace-nowrap ${
        isActive 
          ? 'bg-green-600 text-white shadow-md shadow-green-500/20' 
          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
      }`
    }
  >
    <IconComponent size={20} />
    <span>{label}</span>
  </NavLink>
)};

const Layout = ({ children }) => {
  const { role, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const adminLinks = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/receipts', icon: Receipt, label: 'Receipts' },
    { to: '/admin/students', icon: Users, label: 'Students' },
    { to: '/admin/parents', icon: Users, label: 'Parents' },
    { to: '/admin/attendance', icon: Calendar, label: 'Attendance' },
    { to: '/admin/expenses', icon: Banknote, label: 'Expenses' },
    { to: '/admin/reports', icon: FileText, label: 'Reports' },
    { to: '/admin/logs', icon: Settings, label: 'Audit Logs' },
  ];

  const parentLinks = [
    { to: '/parent', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/parent/receipts', icon: Receipt, label: 'Receipts' },
    { to: '/parent/attendance', icon: Calendar, label: 'Attendance' },
    { to: '/parent/reports', icon: FileText, label: 'Reports' },
    { to: '/parent/enroll', icon: Users, label: 'Enroll Child' },
    { to: '/parent/settings', icon: Settings, label: 'Profile' },
    { to: '/parent/guide', icon: BookOpen, label: 'Parent Guide' },
  ];

  const links = role === 'admin' ? adminLinks : parentLinks;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans relative">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-20 flex px-6 py-6 items-center gap-3 border-b border-slate-800/50">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-green-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
            D
          </div>
          <h1 className="text-white font-bold tracking-tight">DAS Management</h1>
        </div>
        
        <div className="px-6 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center bg-cover bg-center text-slate-300">
             <User size={20}/>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-200 truncate pr-2">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{role}</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto w-[calc(100%-8px)] custom-scrollbar">
          <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 mt-2">Menu</p>
          {links.map((link) => (
            <SidebarItem key={link.to} {...link} />
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800/50">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all font-medium"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50 relative">
        {/* Top Navbar */}
        <header className="h-16 bg-white/70 backdrop-blur-md border-b border-slate-200/50 px-4 sm:px-8 flex items-center justify-between z-10 shadow-sm shrink-0">
           <div className="flex items-center gap-3">
             <button 
               onClick={() => setIsMobileMenuOpen(true)}
               className="p-2 -ml-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 lg:hidden"
             >
               <Menu size={20} />
             </button>
             <h2 className="text-xl font-bold text-slate-800 hidden sm:block">
               DAS Portal
             </h2>
           </div>
           <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500 font-medium">Logged in via Secure Gateway</span>
           </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-7xl mx-auto pb-24 animate-fade-in-up">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
