import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { Send, MessageSquare, Clock, User, PhoneCall, Video, Users, Image, Music, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatDate';

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const fetchPosts = async () => {
    try {
      const { data } = await api.get('/community');
      setPosts(data);
    } catch (err) {
      console.error('Failed to fetch community posts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    const interval = setInterval(fetchPosts, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (selectedFile.type.startsWith('image/')) {
        setFilePreview(URL.createObjectURL(selectedFile));
      } else {
        setFilePreview('audio');
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() && !file) return;

    setSending(true);
    const formData = new FormData();
    formData.append('message', message);
    if (file) {
      formData.append('file', file);
    }

    try {
      const { data } = await api.post('/community', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setPosts([data, ...posts]);
      setMessage('');
      removeFile();
    } catch (err) {
      alert(`Failed to send message: ${err.response?.data?.detail || err.message}`);
    } finally {
      setSending(false);
    }
  };

  const showCallComingSoon = () => {
      alert("Calls are currently not available. This feature is coming soon to the Sierra Leone DAS platform!");
  };

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[#075E54] text-white flex items-center justify-between shadow-md relative z-10 w-full">
          <div className="flex items-center gap-4">
            <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-sm">
                    <Users className="text-white" size={20} />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-[#075E54] rounded-full"></div>
            </div>
            <div>
              <h2 className="text-lg font-bold leading-tight">DAS Community</h2>
              <p className="text-xs text-white/80 font-medium">Admins, Teachers, Parents</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-white/90">
             <Video size={20} className="cursor-pointer hover:text-white transition-colors hidden sm:block" onClick={showCallComingSoon} />
             <PhoneCall size={18} className="cursor-pointer hover:text-white transition-colors hidden sm:block" onClick={showCallComingSoon} />
          </div>
        </div>

        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 flex flex-col-reverse bg-[#E5DDD5] relative"
        >
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-4 border-green-600/20 border-t-green-600 rounded-full animate-spin"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <MessageSquare size={48} className="mx-auto text-slate-200 mb-4" />
              <p className="text-slate-500 font-medium">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            posts.map((post) => {
              const isMine = post.author_name === user?.name;
              
              return (
              <div key={post.id} className={`animate-fade-in flex w-full relative z-10 ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${isMine ? 'items-end' : 'items-start'}`}>
                    
                    {!isMine && (
                        <div className="flex items-center gap-2 mb-1 ml-1">
                            <span className="text-xs font-bold text-slate-800">{post.author_name}</span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded uppercase font-black tracking-widest bg-slate-200/50 text-slate-500">
                                {post.author_role}
                            </span>
                        </div>
                    )}

                    <div className={`relative px-4 py-2.5 rounded-2xl shadow-sm text-[15px] leading-relaxed ${
                        isMine 
                        ? 'bg-[#DCF8C6] text-slate-800 rounded-tr-none' 
                        : 'bg-white text-slate-800 rounded-tl-none'
                    }`}>
                        {post.file_url && (
                          <div className="mb-2">
                            {post.file_type === 'image' ? (
                              <img 
                                src={post.file_url} 
                                alt="Shared" 
                                className="max-w-full rounded-lg shadow-sm border border-black/5 hover:opacity-95 transition-opacity cursor-pointer"
                                onClick={() => window.open(post.file_url, '_blank')}
                              />
                            ) : (
                              <div className="bg-black/5 p-2 rounded-lg flex flex-col gap-2 min-w-[200px]">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-tighter">
                                   <Music size={14} /> Audio Message
                                </div>
                                <audio controls className="w-full h-8 brightness-95 contrast-125">
                                  <source src={post.file_url} />
                                </audio>
                              </div>
                            )}
                          </div>
                        )}

                        {post.message && <div className="break-words whitespace-pre-wrap">{post.message}</div>}
                        
                        <div className={`flex items-center gap-1 mt-1 ${isMine ? 'justify-end' : 'justify-start'}`}>
                            <span className="text-[10px] text-slate-400 font-medium uppercase">
                                {formatDate(post.created_at)} • {new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                        
                        {/* Tail pointer */}
                        <div className={`absolute top-0 w-3 h-4 ${
                            isMine 
                            ? '-right-2 bg-[#DCF8C6]' 
                            : '-left-2 bg-white'
                        }`} style={{ clipPath: isMine ? 'polygon(0 0, 0% 100%, 100% 0)' : 'polygon(100% 0, 100% 100%, 0 0)' }}></div>
                    </div>
                </div>
              </div>
            )})
          )}
        </div>

        {/* Input area */}
        <div className="bg-[#f0f2f5] border-t border-slate-200 z-20 relative px-4 py-3 flex flex-col gap-2">
          {filePreview && (
            <div className="bg-white p-2 rounded-xl flex items-center justify-between border border-slate-200 shadow-sm animate-slide-up">
              <div className="flex items-center gap-3">
                {filePreview === 'audio' ? (
                   <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center">
                     <Music size={24} />
                   </div>
                ) : (
                   <img src={filePreview} className="w-12 h-12 rounded-lg object-cover border border-slate-100" />
                )}
                <div>
                   <p className="text-xs font-bold text-slate-700">{file.name}</p>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Selected {file.type.split('/')[0]}</p>
                </div>
              </div>
              <button 
                onClick={removeFile}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                title="Remove attachment"
              >
                <X size={20} />
              </button>
            </div>
          )}

          <div className="flex items-center gap-1.5 sm:gap-2 pr-1 sm:pr-2">
            <button 
                type="button" 
                onClick={() => {
                    if (fileInputRef.current) {
                        fileInputRef.current.accept = "image/*";
                        fileInputRef.current.click();
                    }
                }}
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-slate-500 hover:text-[#00A884] transition-colors rounded-full hover:bg-slate-200"
                title="Send Photo"
            >
              <Image size={22} />
            </button>
            
            <button 
                type="button" 
                onClick={() => {
                    if (fileInputRef.current) {
                        fileInputRef.current.accept = "audio/*";
                        fileInputRef.current.click();
                    }
                }}
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-slate-500 hover:text-[#00A884] transition-colors rounded-full hover:bg-slate-200"
                title="Send Audio / Voice"
            >
              <Mic size={22} />
            </button>

            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden" 
            />
            
            <form onSubmit={handleSend} className="flex gap-1.5 sm:gap-2 w-full items-center">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
                className="flex-1 px-4 sm:px-5 py-2.5 sm:py-3.5 bg-white border-none rounded-full outline-none focus:ring-1 focus:ring-green-500/30 transition-shadow font-medium text-[14px] sm:text-[15px] shadow-sm min-w-0"
              />
              <button
                type="submit"
                disabled={sending || (!message.trim() && !file)}
                className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-[#00A884] text-white rounded-full shadow-md hover:bg-[#008f6f] transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex-shrink-0"
              >
                {sending ? <Clock size={18} className="animate-spin" /> : <Send size={18} className="ml-0.5 sm:ml-1" />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Community;
