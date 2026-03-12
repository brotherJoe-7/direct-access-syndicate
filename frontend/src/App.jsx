import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ParentDashboard from './pages/ParentDashboard';
import Receipts from './pages/Receipts';
import NewReceipt from './pages/NewReceipt';
import Students from './pages/Students';
import Attendance from './pages/Attendance';
import Expenses from './pages/Expenses';
import Feedbacks from './pages/Feedbacks';
import AdminParents from './pages/AdminParents';
import Apply from './pages/Apply';
import Contact from './pages/Contact';
import Services from './pages/Services';
import About from './pages/About';
import ParentGuide from './pages/ParentGuide';
import Community from './pages/Community';
import Learning from './pages/Learning';
import Grades from './pages/Grades';
import StaffPortal from './pages/StaffPortal';
import StaffManagement from './pages/StaffManagement';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CallProvider } from './context/CallContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import VideoRoom from './pages/VideoRoom';
import IncomingCall from './components/IncomingCall';

const RoleBasedRedirect = () => {
    const { user, role } = useAuth();
    if (!user) return <Navigate to="/login" />;
    if (role === 'admin') return <Navigate to="/admin" />;
    if (role === 'teacher') return <Navigate to="/admin/portal" />;
    return <Navigate to="/parent" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <CallProvider>
          <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            <IncomingCall />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/apply" element={<Apply />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<About />} />
              
              <Route path="/dashboard" element={<RoleBasedRedirect />} />

              {/* Secure Full Screen Routes (No Sidebar) */}
              <Route path="/video-call/:roomName" element={
                <ProtectedRoute>
                  <VideoRoom />
                </ProtectedRoute>
              } />
              
              {/* Protected Routes with Sidebar Layout */}
              <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                {/* Admin/Teacher Routes */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/portal" element={<StaffPortal />} />
                <Route path="/admin/receipts" element={<Receipts />} />
                <Route path="/admin/receipts/new" element={<NewReceipt />} />
                <Route path="/admin/students" element={<Students />} />
                <Route path="/admin/parents" element={<AdminParents />} />
                <Route path="/admin/attendance" element={<Attendance />} />
                <Route path="/admin/expenses" element={<Expenses />} />
                <Route path="/admin/reports" element={<Feedbacks />} />
                <Route path="/admin/community" element={<Community />} />
                <Route path="/admin/learning" element={<Learning />} />
                <Route path="/admin/grades" element={<Grades />} />
                <Route path="/admin/staff" element={<StaffManagement />} />

                {/* Parent Routes */}
                <Route path="/parent" element={<ParentDashboard />} />
                <Route path="/parent/receipts" element={<Receipts />} />
                <Route path="/parent/attendance" element={<Attendance />} />
                <Route path="/parent/reports" element={<Feedbacks />} />
                <Route path="/parent/guide" element={<ParentGuide />} />
                <Route path="/parent/community" element={<Community />} />
                <Route path="/parent/learning" element={<Learning />} />
              </Route>
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </CallProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
