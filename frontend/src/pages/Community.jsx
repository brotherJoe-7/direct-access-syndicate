import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { Send, MessageSquare, Clock, PhoneCall, Video, Users, Image, Music, X, Mic, ArrowLeft, Trash2, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCall } from '../context/CallContext';
import { formatDate } from '../utils/formatDate';

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Call type selector state
  const [showCallMenu, setShowCallMenu] = useState(false);

  // Long-press context menu state
  const [contextMenu, setContextMenu] = useState(null); // { postId, isMine, x, y }
  const longPressTimerRef = useRef(null);

  // Voice Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);

  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { startCall } = useCall();
  const fileInputRef = useRef(null);

  const fetchPosts = async () => {
    try {
      const { data } = await api.get('/community');
      if (Array.isArray(data)) {
        setPosts(data.filter(p => !p.deleted));
      } else {
        setPosts([]);
      }
    } catch (err) {
      console.error('Failed to fetch community posts', err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    const interval = setInterval(fetchPosts, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close context menu on outside tap
  useEffect(() => {
    const handler = () => setContextMenu(null);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
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
    if (file) formData.append('file', file);

    try {
      const { data } = await api.post('/community', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setPosts(prev => [data, ...prev]);
      setMessage('');
      removeFile();
    } catch (err) {
      alert(`Failed to send message: ${err.response?.data?.detail || err.message}`);
    } finally {
      setSending(false);
    }
  };

  // --- Voice Recording ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      let mimeType = 'audio/webm';
      let ext = 'webm';
      if (!MediaRecorder.isTypeSupported('audio/webm') && MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
        ext = 'm4a';
      }
      const options = { mimeType, audioBitsPerSecond: 16000 };
      const mediaRecorder = new MediaRecorder(stream, MediaRecorder.isTypeSupported(mimeType) ? options : undefined);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const audioFile = new File([audioBlob], `voice_note_${Date.now()}.${ext}`, { type: mimeType });
        setFile(audioFile);
        setFilePreview('audio');
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerIntervalRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    } catch (error) {
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerIntervalRef.current);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      audioChunksRef.current = [];
      setIsRecording(false);
      clearInterval(timerIntervalRef.current);
      setFile(null);
      setFilePreview(null);
    }
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  // --- Group Call ---
  const initiateGroupCall = async (type = 'video') => {
    setShowCallMenu(false);
    const roomName = `das-community-${Date.now()}`;
    const success = await startCall(roomName, type);
    if (success) {
      navigate(`/video-call/${roomName}`);
    } else {
      alert("Failed to initiate call. Please check your connection.");
    }
  };

  // --- Long Press Handlers ---
  const handleTouchStart = (e, post, isMine) => {
    e.persist();
    longPressTimerRef.current = setTimeout(() => {
      const touch = e.touches[0];
      setContextMenu({ postId: post.id, isMine, x: touch.clientX, y: touch.clientY });
    }, 600);
  };

  const handleTouchEnd = () => {
    clearTimeout(longPressTimerRef.current);
  };

  const handleRightClick = (e, post, isMine) => {
    e.preventDefault();
    setContextMenu({ postId: post.id, isMine, x: e.clientX, y: e.clientY });
  };

  // --- Delete Message ---
  const handleDelete = async (postId) => {
    setContextMenu(null);
    try {
      await api.delete(`/community/${postId}`);
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete message');
    }
  };

  return (
    <>
      <div className="flex flex-col fixed inset-0 z-[100] md:relative md:inset-auto md:z-auto h-[100dvh] md:h-[calc(100vh-12rem)] w-full max-w-4xl mx-auto bg-white md:rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">

        {/* Call Type Selector Bottom Sheet (Mobile) */}
        {showCallMenu && (
          <div className="fixed inset-0 z-[200]" onClick={() => setShowCallMenu(false)}>
            <div className="absolute inset-0 bg-black/50" />
            <div
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-6" />
              <h3 className="text-center font-bold text-slate-800 text-lg mb-6">Start a Group Call</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => initiateGroupCall('video')}
                  className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-blue-50 border-2 border-blue-100 hover:border-blue-400 active:scale-95 transition-all"
                >
                  <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Video size={28} className="text-white" />
                  </div>
                  <span className="font-bold text-blue-700">Video Call</span>
                  <span className="text-xs text-blue-500 text-center">See each other face to face</span>
                </button>
                <button
                  onClick={() => initiateGroupCall('audio')}
                  className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-green-50 border-2 border-green-100 hover:border-green-400 active:scale-95 transition-all"
                >
                  <div className="w-14 h-14 rounded-full bg-[#00A884] flex items-center justify-center shadow-lg shadow-green-500/30">
                    <Phone size={28} className="text-white" />
                  </div>
                  <span className="font-bold text-green-700">Audio Call</span>
                  <span className="text-xs text-green-500 text-center">Voice only, saves data</span>
                </button>
              </div>
              <button
                onClick={() => setShowCallMenu(false)}
                className="w-full mt-4 py-3 text-slate-500 font-medium text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Context Menu (Long Press) */}
        {contextMenu && (
          <div
            className="fixed z-[300] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden min-w-[180px]"
            style={{
              top: Math.min(contextMenu.y, window.innerHeight - 120),
              left: Math.min(contextMenu.x, window.innerWidth - 200),
            }}
            onClick={e => e.stopPropagation()}
          >
            {contextMenu.isMine && (
              <button
                onClick={() => handleDelete(contextMenu.postId)}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors font-medium text-sm"
              >
                <Trash2 size={16} />
                Delete Message
              </button>
            )}
            <button
              onClick={() => setContextMenu(null)}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 transition-colors font-medium text-sm border-t border-slate-100"
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        )}

        {/* Header */}
        <div className="px-3 md:px-6 py-3 md:py-4 bg-[#075E54] text-white flex items-center justify-between shadow-md relative z-10 w-full">
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 text-white hover:bg-white/20 rounded-full transition-colors md:hidden"
            >
              <ArrowLeft size={22} />
            </button>
            <div className="relative">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
                <Users className="text-white" size={20} />
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-[#075E54] rounded-full"></div>
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold leading-tight">DAS Community</h2>
              <p className="text-[10px] md:text-xs text-white/80 font-medium">Admins, Teachers, Parents</p>
            </div>
          </div>

          {/* Call Button — always visible, opens toggle sheet */}
          <button
            type="button"
            onClick={() => setShowCallMenu(true)}
            className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 active:bg-white/30 px-3 py-2 rounded-full transition-colors border border-white/20"
            title="Start a Group Call"
          >
            <PhoneCall size={16} />
            <span className="text-xs font-bold hidden sm:inline">Call</span>
            <Video size={16} className="opacity-70" />
          </button>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 flex flex-col-reverse bg-[#E5DDD5] relative"
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
                <div
                  key={post.id}
                  className={`animate-fade-in flex w-full relative z-10 ${isMine ? 'justify-end' : 'justify-start'}`}
                  onTouchStart={(e) => handleTouchStart(e, post, isMine)}
                  onTouchEnd={handleTouchEnd}
                  onTouchMove={handleTouchEnd}
                  onContextMenu={(e) => handleRightClick(e, post, isMine)}
                >
                  <div className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${isMine ? 'items-end' : 'items-start'}`}>
                    {!isMine && (
                      <div className="flex items-center gap-2 mb-1 ml-1">
                        <span className="text-xs font-bold text-slate-800">{post.author_name}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded uppercase font-black tracking-widest bg-slate-200/50 text-slate-500">
                          {post.author_role}
                        </span>
                      </div>
                    )}
                    <div className={`relative px-3 py-2.5 rounded-2xl shadow-sm text-[14px] sm:text-[15px] leading-relaxed ${
                      isMine ? 'bg-[#DCF8C6] text-slate-800 rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none'
                    }`}>
                      {post.file_url && (
                        <div className="mb-2">
                          {post.file_type === 'image' ? (
                            <img
                              src={post.file_url}
                              alt="Shared"
                              className="max-w-full max-h-64 object-contain rounded-lg shadow-sm border border-black/5 cursor-pointer"
                              onClick={() => window.open(post.file_url, '_blank')}
                            />
                          ) : (
                            <div className="bg-black/5 p-2 rounded-lg flex flex-col gap-2 min-w-[180px] max-w-full sm:max-w-xs">
                              <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-tighter">
                                <Music size={14} /> Audio Message
                              </div>
                              <audio controls className="w-full h-8">
                                <source src={post.file_url} />
                              </audio>
                            </div>
                          )}
                        </div>
                      )}
                      {post.message && <div className="break-words whitespace-pre-wrap">{post.message}</div>}
                      <div className={`flex items-center gap-1 mt-1 ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {formatDate(post.created_at)} • {new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className={`absolute top-0 w-3 h-4 ${isMine ? '-right-2 bg-[#DCF8C6]' : '-left-2 bg-white'}`}
                        style={{ clipPath: isMine ? 'polygon(0 0, 0% 100%, 100% 0)' : 'polygon(100% 0, 100% 100%, 0 0)' }}>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input area */}
        <div className="bg-[#f0f2f5] border-t border-slate-200 z-20 relative px-3 py-2.5 flex flex-col gap-2">
          {filePreview && (
            <div className="bg-white p-2 rounded-xl flex items-center justify-between border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3">
                {filePreview === 'audio' ? (
                  <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center">
                    <Music size={20} />
                  </div>
                ) : (
                  <img src={filePreview} className="w-10 h-10 rounded-lg object-cover border border-slate-100" alt="preview" />
                )}
                <div>
                  <p className="text-xs font-bold text-slate-700 truncate max-w-[150px]">{file.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{file.type.split('/')[0]}</p>
                </div>
              </div>
              <button onClick={removeFile} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded-full">
                <X size={18} />
              </button>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => { if (fileInputRef.current) { fileInputRef.current.accept = "image/*"; fileInputRef.current.click(); }}}
              className="w-9 h-9 flex items-center justify-center text-slate-500 hover:text-[#00A884] transition-colors rounded-full hover:bg-slate-200 flex-shrink-0"
              title="Send Photo"
            >
              <Image size={20} />
            </button>

            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-9 h-9 flex items-center justify-center transition-colors rounded-full flex-shrink-0 ${
                isRecording ? 'bg-red-500 text-white animate-pulse' : 'text-slate-500 hover:text-[#00A884] hover:bg-slate-200'
              }`}
              title="Voice Note"
            >
              <Mic size={20} />
            </button>

            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

            {isRecording ? (
              <div className="flex gap-2 w-full items-center bg-white rounded-full px-3 py-2 shadow-sm border border-red-100 flex-1">
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                  <span className="text-red-500 font-medium font-mono text-sm">{formatTime(recordingTime)}</span>
                  <span className="text-xs text-slate-500 hidden sm:block">Recording...</span>
                </div>
                <button onClick={cancelRecording} className="text-slate-400 hover:text-red-500 font-medium text-xs px-2 transition-colors">
                  Cancel
                </button>
                <button onClick={stopRecording} className="w-7 h-7 flex items-center justify-center bg-red-50 text-red-500 rounded-full hover:bg-red-100">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-sm"></div>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSend} className="flex gap-1.5 w-full items-center">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message"
                  className="flex-1 px-4 py-2.5 bg-white border-none rounded-full outline-none focus:ring-1 focus:ring-green-500/30 font-medium text-[14px] shadow-sm min-w-0"
                />
                <button
                  type="submit"
                  disabled={sending || (!message.trim() && !file)}
                  className="w-10 h-10 flex items-center justify-center bg-[#00A884] text-white rounded-full shadow-md hover:bg-[#008f6f] transition-all active:scale-95 disabled:opacity-50 flex-shrink-0"
                >
                  {sending ? <Clock size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Community;
