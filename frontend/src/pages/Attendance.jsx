import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Calendar, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatDate';

const Attendance = () => {
  const [records, setRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
     student_id: '', date: new Date().toISOString().split('T')[0], status: 'Present'
  });
  const { role } = useAuth();

  const fetchData = async () => {
    try {
      const [attRes, stuRes] = await Promise.all([
          api.get('/attendance'),
          api.get('/students')
      ]);
      setRecords(attRes.data);
      setStudents(stuRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          await api.post('/attendance', formData);
          setFormData({ ...formData, status: 'Present', student_id: '' });
          fetchData();
      } catch (err) {
          console.error('Error marking attendance', err);
          alert('Error marking attendance');
      }
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Attendance Tracker</h1>
        <p className="text-slate-500">Record and view student attendance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Section - ADMIN ONLY */}
        {role === 'admin' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-fit">
            <div className="flex items-center gap-2 mb-6">
                <UserCheck className="text-green-500" size={20} />
                <h2 className="text-lg font-bold text-slate-800">Mark Attendance</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Select Student</label>
                    <select required value={formData.student_id} onChange={(e) => setFormData({...formData, student_id: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none">
                        <option value="">-- Choose --</option>
                        {students.map(s => <option key={s.id} value={s.id}>{s.student_name}</option>)}
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Date</label>
                    <input type="date" required value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" />
                </div>
                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Status</label>
                    <select required value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none">
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Late">Late</option>
                    </select>
                </div>
                <button type="submit" disabled={loading} className="w-full py-3 mt-2 bg-green-600 text-white rounded-xl font-medium shadow-md shadow-green-500/20 hover:bg-green-700 transition-colors">
                    Save Record
                </button>
            </form>
        </div>
        )}

        {/* History Section */}
        <div className={`${role === 'admin' ? 'lg:col-span-2' : 'lg:col-span-3'} bg-white rounded-2xl shadow-sm border border-slate-100 p-6`}>
            <div className="flex items-center gap-2 mb-6">
                <Calendar className="text-emerald-500" size={20} />
                <h2 className="text-lg font-bold text-slate-800">Recent Records</h2>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/50">
                        <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-widest">Date</th>
                        <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-widest">Student Name</th>
                        <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-widest">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {records.map((record) => (
                        <tr key={record.id} className="hover:bg-slate-50/50">
                            <td className="px-4 py-3 font-medium text-slate-700">{formatDate(record.date)}</td>
                            <td className="px-4 py-3 font-bold text-slate-800">{record.student_name}</td>
                            <td className="px-4 py-3">
                                <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                                    record.status === 'Present' ? 'bg-emerald-100 text-emerald-700' :
                                    record.status === 'Absent' ? 'bg-red-100 text-red-700' :
                                    'bg-amber-100 text-amber-700'
                                }`}>
                                    {record.status}
                                </span>
                            </td>
                        </tr>
                        ))}
                        {!loading && records.length === 0 && (
                        <tr><td colSpan="3" className="px-4 py-8 text-center text-slate-500">No attendance records found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

      </div>
    </>
  );
};

export default Attendance;
