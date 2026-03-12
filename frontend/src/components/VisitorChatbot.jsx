import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, ArrowLeft, Sparkles, Loader2, MessageCircle } from 'lucide-react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'https://direct-access-syndicate.vercel.app/api';

// Pre-written quick questions visitors often ask
const QUICK_QUESTIONS = [
  "What is Direct Access Syndicate?",
  "How do I enrol my child?",
  "What classes do you offer?",
  "How do parents track attendance?",
  "What are the school fees?",
];

const VisitorChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      role: 'model',
      text: "👋 Welcome to **Direct Access Syndicate**! I'm your virtual guide.\n\nI can answer questions about our school, admission process, fees, and more. What would you like to know?",
    },
  ]);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    setHasOpened(true);
    setTimeout(() => inputRef.current?.focus(), 300);
  };

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { role: 'user', text };
    setChatHistory(prev => [...prev, userMsg]);
    setMessage('');
    setLoading(true);

    try {
      const { data } = await axios.post(`${API_BASE}/ai/visitor`, {
        message: text,
        history: chatHistory.slice(1),
      });
      setChatHistory(prev => [...prev, { role: 'model', text: data.text }]);
    } catch {
      setChatHistory(prev => [...prev, {
        role: 'model',
        text: "I'm having trouble connecting right now. Please call us directly or visit the Contact page.",
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(message);
  };

  // Simple markdown-like renderer
  const renderText = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) =>
      part.startsWith('**') && part.endsWith('**')
        ? <strong key={i}>{part.slice(2, -2)}</strong>
        : part
    );
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={handleOpen}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 shadow-2xl transition-all duration-300 ${
          isOpen
            ? 'w-12 h-12 rounded-full bg-red-500 justify-center hidden'
            : 'px-4 py-3 rounded-2xl bg-[#003B5C] hover:bg-[#002b44] text-white'
        }`}
        title="Chat with us"
      >
        {!isOpen && (
          <>
            <div className="relative">
              <Sparkles size={12} className="absolute -top-1 -right-1 text-yellow-300" />
              <Bot size={22} />
            </div>
            <span className="font-bold text-sm whitespace-nowrap">Ask about DAS</span>
            {!hasOpened && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
            )}
          </>
        )}
      </button>

      {/* Chat Window */}
      <div
        className={`fixed z-[60] transition-all duration-300 origin-bottom-right
          inset-0 sm:inset-auto sm:bottom-24 sm:right-6
          sm:w-[400px] sm:h-[560px]
          ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-0 pointer-events-none'}`}
      >
        <div className="w-full h-full flex flex-col bg-white sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-[#003B5C] to-[#005a8e] p-4 text-white flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 -ml-1 hover:bg-white/20 rounded-full transition-colors sm:hidden"
              >
                <ArrowLeft size={22} />
              </button>
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
                <Bot size={22} className="text-blue-200" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight">DAS Virtual Guide</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <p className="text-[10px] text-blue-200 uppercase font-bold tracking-widest">Online • Powered by Gemini AI</p>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="opacity-70 hover:opacity-100 hidden sm:flex p-1.5 hover:bg-white/20 rounded-full transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'model' && (
                  <div className="w-7 h-7 rounded-full bg-[#003B5C] flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                    <Bot size={14} className="text-blue-200" />
                  </div>
                )}
                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm shadow-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-[#003B5C] text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                }`}>
                  {renderText(msg.text)}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="w-7 h-7 rounded-full bg-[#003B5C] flex items-center justify-center mr-2 flex-shrink-0">
                  <Bot size={14} className="text-blue-200" />
                </div>
                <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin text-blue-500" />
                  <span className="text-xs text-slate-400 italic">Thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Questions — show only at start */}
          {chatHistory.length <= 1 && (
            <div className="px-4 py-2 bg-white border-t border-slate-100 flex flex-col gap-2 flex-shrink-0">
              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Suggested Questions</p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(q)}
                    className="text-xs px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition-colors font-medium"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 bg-white border-t border-slate-100 flex-shrink-0">
            <form onSubmit={handleSubmit} className="flex gap-2 items-center">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about admissions, fees, classes..."
                className="flex-1 px-4 py-2.5 bg-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/30 transition-all border-none"
              />
              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="w-10 h-10 bg-[#003B5C] text-white rounded-xl flex items-center justify-center hover:bg-[#002b44] transition-all active:scale-95 disabled:opacity-40 flex-shrink-0"
              >
                <Send size={16} />
              </button>
            </form>
            <p className="text-[9px] text-center text-slate-300 mt-2 uppercase font-black tracking-widest">
              Direct Access Syndicate — Sierra Leone
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default VisitorChatbot;
