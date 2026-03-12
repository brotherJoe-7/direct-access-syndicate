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

const ProtectedRoute = ({ children, roleRequired }) => {
  const { user, role } = useAuth();
  if (!user) return <Navigate to="/login" />;
  
  if (roleRequired) {
    const roles = Array.isArray(roleRequired) ? roleRequired : [roleRequired];
    if (!roles.includes(role)) return <Navigate to="/" />;
  }
  
  return children;
};

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
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/apply" element={<Apply />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            
            {/* Redirect / to dash based on role or login */}
            <Route path="/dashboard" element={<RoleBasedRedirect />} />
            
            <Route path="/admin/*" element={
              <ProtectedRoute roleRequired="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/portal" element={
              <ProtectedRoute roleRequired={['admin', 'teacher']}>
                <StaffPortal />
              </ProtectedRoute>
            } />
            <Route path="/admin/receipts" element={
              <ProtectedRoute roleRequired="admin">
                <Receipts />
              </ProtectedRoute>
            } />
            <Route path="/admin/receipts/new" element={
              <ProtectedRoute roleRequired="admin">
                <NewReceipt />
              </ProtectedRoute>
            } />
            <Route path="/admin/students" element={
              <ProtectedRoute roleRequired="admin">
                <Students />
              </ProtectedRoute>
            } />
            <Route path="/admin/parents" element={
              <ProtectedRoute roleRequired="admin">
                <AdminParents />
              </ProtectedRoute>
            } />
            <Route path="/admin/attendance" element={
              <ProtectedRoute roleRequired={['admin', 'teacher']}>
                <Attendance />
              </ProtectedRoute>
            } />
            <Route path="/admin/expenses" element={
              <ProtectedRoute roleRequired="admin">
                <Expenses />
              </ProtectedRoute>
            } />
            <Route path="/admin/reports" element={
              <ProtectedRoute roleRequired={['admin', 'teacher']}>
                <Feedbacks />
              </ProtectedRoute>
            } />
            <Route path="/admin/community" element={
              <ProtectedRoute roleRequired={['admin', 'teacher']}>
                <Community />
              </ProtectedRoute>
            } />
            <Route path="/admin/learning" element={
              <ProtectedRoute roleRequired={['admin', 'teacher']}>
                <Learning />
              </ProtectedRoute>
            } />
            <Route path="/admin/grades" element={
              <ProtectedRoute roleRequired={['admin', 'teacher']}>
                <Grades />
              </ProtectedRoute>
            } />
            <Route path="/admin/staff" element={
              <ProtectedRoute roleRequired="admin">
                <StaffManagement />
              </ProtectedRoute>
            } />
            
            <Route path="/parent/*" element={
              <ProtectedRoute roleRequired="parent">
                <ParentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/parent/receipts" element={
              <ProtectedRoute roleRequired="parent">
                <Receipts />
              </ProtectedRoute>
            } />
            <Route path="/parent/attendance" element={
              <ProtectedRoute roleRequired="parent">
                <Attendance />
              </ProtectedRoute>
            } />
            <Route path="/parent/reports" element={
              <ProtectedRoute roleRequired="parent">
                <Feedbacks />
              </ProtectedRoute>
            } />
            <Route path="/parent/guide" element={
              <ProtectedRoute roleRequired="parent">
                <ParentGuide />
              </ProtectedRoute>
            } />
            <Route path="/parent/community" element={
              <ProtectedRoute roleRequired="parent">
                <Community />
              </ProtectedRoute>
            } />
            <Route path="/parent/learning" element={
              <ProtectedRoute roleRequired="parent">
                <Learning />
              </ProtectedRoute>
            } />
            
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
