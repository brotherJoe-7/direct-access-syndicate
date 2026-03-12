import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Bot, User, Clock, Loader2, Sparkles, MessageCircleCode } from 'lucide-react';
import api from '../utils/api';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'model', text: 'Hello! I am your DAS AI Assistant. How can I help you today?' }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMessage = { role: 'user', text: message };
    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');
    setLoading(true);

    try {
      const { data } = await api.post('/ai/chat', {
        message,
        history: chatHistory.slice(1) // Don't send initial greeting
      });

      setChatHistory(prev => [...prev, { role: 'model', text: data.text }]);
    } catch (err) {
      console.error('AI Assistant Error:', err);
      setChatHistory(prev => [...prev, { 
        role: 'model', 
        text: 'Sorry, I am having trouble connecting right now. Please try again later.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 z-50 animate-bounce-slow ${
          isOpen ? 'bg-red-500 rotate-90' : 'bg-[#003B5C] hover:bg-[#002b44]'
        }`}
      >
        {isOpen ? <X className="text-white" size={24} /> : <div className="relative"><Sparkles className="text-white absolute -top-1 -right-1" size={12} /><Bot className="text-white" size={28} /></div>}
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-6 w-[90vw] sm:w-[400px] h-[500px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden transition-all duration-300 z-50 origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-0 opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-[#003B5C] p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot size={22} className="text-blue-200" />
             </div>
             <div>
               <h3 className="font-bold text-sm leading-tight">DAS Assistant</h3>
               <p className="text-[10px] text-blue-200 uppercase font-bold tracking-widest">Powered by Gemini AI</p>
             </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="opacity-70 hover:opacity-100">
             <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50"
        >
          {chatHistory.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                  msg.role === 'user' 
                  ? 'bg-[#00A884] text-white rounded-tr-none' 
                  : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                }`}>
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white px-4 py-2.5 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-2">
                 <Loader2 size={16} className="animate-spin text-blue-500" />
                 <span className="text-xs text-slate-400 font-medium italic">Assistant is thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer/Input */}
        <div className="p-4 bg-white border-t border-slate-100">
          <form onSubmit={handleSend} className="relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask anything..."
              className="w-full pl-4 pr-12 py-3 bg-slate-100 border-none rounded-2xl text-sm focus:ring-1 focus:ring-blue-500/30 outline-none transition-shadow"
            />
            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="absolute right-2 top-1.5 w-9 h-9 bg-[#003B5C] text-white rounded-xl flex items-center justify-center hover:bg-[#002b44] transition-all disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </form>
          <p className="text-[9px] text-center text-slate-300 mt-2 uppercase font-black tracking-tighter">Sierra Leone School Tech Syndicate</p>
        </div>
      </div>
    </>
  );
};

export default AIChatbot;
