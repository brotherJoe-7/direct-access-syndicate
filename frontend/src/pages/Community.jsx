import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { Send, Users, MessageSquare, Clock, User } from 'lucide-react';

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

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
    // Refresh every 30 seconds
    const interval = setInterval(fetchPosts, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [posts]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSending(true);
    try {
      const { data } = await api.post('/community', { message });
      setPosts([data, ...posts]);
      setMessage('');
    } catch (err) {
      alert(`Failed to send message: ${err.response?.data?.detail || err.message}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500 rounded-xl">
              <MessageSquare size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">DAS Community Forum</h2>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Admins, Teachers & Parents</p>
            </div>
          </div>
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center">
                <User size={14} className="text-slate-500" />
              </div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-green-500 flex items-center justify-center text-[10px] font-bold">
              +12
            </div>
          </div>
        </div>

        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col-reverse"
        >
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
            posts.map((post) => (
              <div key={post.id} className="animate-fade-in">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md ${
                    post.author_role === 'admin' ? 'bg-slate-800' : 'bg-green-600'
                  }`}>
                    {post.author_name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-bold text-slate-800">{post.author_name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-black uppercase tracking-widest ${
                        post.author_role === 'admin' ? 'bg-slate-100 text-slate-600' : 'bg-green-50 text-green-600'
                      }`}>
                        {post.author_role}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none border border-slate-100/50 text-slate-700 shadow-sm leading-relaxed">
                      {post.message}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div className="p-4 bg-slate-50 border-t border-slate-100">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 px-5 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-green-500/20 transition-all font-medium"
            />
            <button
              type="submit"
              disabled={sending || !message.trim()}
              className="p-3.5 bg-green-600 text-white rounded-2xl shadow-lg shadow-green-500/30 hover:bg-green-700 transition-all active:scale-95 disabled:opacity-50"
            >
              {sending ? <Clock size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Community;
