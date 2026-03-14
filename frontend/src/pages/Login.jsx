import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, User, AlertCircle } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loginMode, setLoginMode] = useState('password'); // 'password' or 'whatsapp'
  const [otpStep, setOtpStep] = useState(1); // 1: phone, 2: code
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, requestOTP, verifyOTP } = useAuth();
  const navigate = useNavigate();

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await requestOTP(phone);
      setOtpStep(2);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await verifyOTP(phone, otp);
      navigate('/');
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-600/30 blur-[120px] rounded-full mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-600/30 blur-[120px] rounded-full mix-blend-screen" />

      <div className="z-10 w-full max-w-md p-8 glass rounded-2xl animate-fade-in-up">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-500 mb-2">
            DAS Management
          </h1>
          <p className="text-slate-400 text-sm">Welcome to Direct Access Syndicate</p>
        </div>

        {/* Mode Toggle */}
        <div className="bg-slate-800/50 p-1 rounded-xl flex mb-8 border border-slate-700/30">
          <button 
            onClick={() => setLoginMode('password')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${loginMode === 'password' ? 'bg-green-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Staff / Admin
          </button>
          <button 
            onClick={() => { setLoginMode('whatsapp'); setOtpStep(1); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${loginMode === 'whatsapp' ? 'bg-green-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Parent Login
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-400">
            <AlertCircle size={20} />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {loginMode === 'password' ? (
          <form onSubmit={handlePasswordLogin} className="space-y-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300 ml-1">Username / Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={18} className="text-slate-500" />
                </div>
                <input
                  type="text"
                  className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all text-slate-200 placeholder:text-slate-500"
                  placeholder="Enter credential"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-500" />
                </div>
                <input
                  type="password"
                  className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all text-slate-200 placeholder:text-slate-500"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl font-bold shadow-lg shadow-teal-500/20 active:scale-95 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Signing In...' : 'Login to Dashboard'}
            </button>
          </form>
        ) : (
          <form onSubmit={otpStep === 1 ? handleRequestOTP : handleVerifyOTP} className="space-y-6">
            {otpStep === 1 ? (
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-300 ml-1">WhatsApp Phone Number</label>
                <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 text-sm font-bold">
                    +232
                  </div>
                  <input
                    type="tel"
                    className="w-full pl-14 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all text-slate-200 placeholder:text-slate-500"
                    placeholder="77XXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-2 ml-1 italic">We will send a security code to your WhatsApp.</p>
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-300 ml-1 text-center block">Enter 6-Digit Code</label>
                <input
                  type="text"
                  maxLength="6"
                  className="w-full py-4 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all text-slate-200 text-center text-3xl font-black tracking-widest"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  autoFocus
                />
                <button 
                  type="button" 
                  onClick={() => setOtpStep(1)}
                  className="text-xs text-green-500 font-bold mt-2 block mx-auto hover:underline"
                >
                  Change phone number
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-500/20 active:scale-95 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : otpStep === 1 ? 'Send WhatsApp Code' : 'Verify & Login'}
            </button>
          </form>
        )}
        
        <div className="mt-8 pt-6 border-t border-slate-700/30 flex items-center justify-center gap-2 opacity-50">
          <Lock size={12} className="text-green-500" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Secured by Joseph Nimneh Encryption
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
