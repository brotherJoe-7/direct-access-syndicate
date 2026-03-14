import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { BookOpen, ExternalLink, Plus, Trash2, Search, Filter, Bookmark, Video, FileText, Download, PlayCircle, Link as LinkIcon, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Learning = () => {
    const { role } = useAuth();
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null); // Enhanced: Read-only viewer state
    const [filterLevel, setFilterLevel] = useState('All');
    const [uploadType, setUploadType] = useState('link'); // 'link' or 'file'
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        title: '', description: '', content_link: '', level_target: 'All'
    });

    const levels = ['All', 'Nursery', 'Primary', 'JSS', 'SSS Arts', 'SSS Science', 'SSS Commercial', 'IGCSE'];

    const fetchMaterials = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/learning?level=${filterLevel}`);
            setMaterials(data);
        } catch (err) {
            console.error('Failed to fetch learning materials', err);
        } finally {
            setLoading(false);
        }
    }, [filterLevel]);

    useEffect(() => {
        fetchMaterials();
    }, [filterLevel]);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            if (uploadType === 'file') {
                const data = new FormData();
                data.append('title', formData.title);
                data.append('description', formData.description);
                data.append('level_target', formData.level_target);
                if (file) data.append('file', file);
                await api.post('/learning', data, { headers: { 'Content-Type': 'multipart/form-data' }});
            } else {
                await api.post('/learning', formData);
            }
            
            setFormData({ title: '', description: '', content_link: '', level_target: 'All' });
            setFile(null);
            setIsModalOpen(false);
            fetchMaterials();
        } catch (err) {
            console.error(err);
            alert('Failed to add material. Check that all fields are filled properly.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this resource?')) return;
        try {
            await api.delete(`/learning/${id}`);
            fetchMaterials();
        } catch (err) {
            console.error('Delete failed:', err);
            alert('Failed to delete material');
        }
    };

    return (
        <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Learning Hub</h1>
                    <p className="text-slate-500 font-medium">Extra study materials, notes, and educational resources.</p>
                </div>
                {(role === 'admin' || role === 'teacher') && (
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-2xl font-bold shadow-lg shadow-green-500/20 transition-all active:scale-95"
                    >
                        <Plus size={20} /> Add Resource
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
                <div className="p-2 bg-white border border-slate-200 rounded-xl flex items-center gap-2 text-slate-400">
                    <Filter size={18} />
                </div>
                {levels.map(lvl => (
                    <button
                        key={lvl}
                        onClick={() => setFilterLevel(lvl)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                            filterLevel === lvl 
                            ? 'bg-slate-900 text-white shadow-md' 
                            : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'
                        }`}
                    >
                        {lvl}
                    </button>
                ))}
            </div>

            {/* Materials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 flex justify-center">
                        <div className="w-12 h-12 border-4 border-green-600/20 border-t-green-600 rounded-full animate-spin"></div>
                    </div>
                ) : materials.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                        <BookOpen size={48} className="mx-auto text-slate-200 mb-4" />
                        <p className="text-slate-500 font-medium">No resources found for the selected level.</p>
                    </div>
                ) : (
                    materials.map(mat => {
                        let IconMarker = Bookmark;
                        if (mat.material_type === 'local_video' || mat.material_type === 'youtube') IconMarker = Video;
                        else if (mat.material_type === 'document') IconMarker = FileText;

                        const fullLink = mat.file_path 
                            ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${mat.file_path}` 
                            : mat.content_link;

                        return (
                        <div key={mat.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group relative overflow-hidden flex flex-col justify-between">
                           <div>
                               <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                   {(role === 'admin' || role === 'teacher') && (
                                       <button 
                                           onClick={() => handleDelete(mat.id)}
                                           className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                                       >
                                           <Trash2 size={16} />
                                       </button>
                                   )}
                               </div>
                               
                               <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                   <IconMarker size={24} />
                               </div>
                               
                               <div className="mb-4">
                                   <div className="flex items-center gap-2">
                                       <span className="text-[10px] font-black uppercase tracking-widest text-green-600 bg-green-50 px-2 py-0.5 rounded">
                                           {mat.level_target}
                                       </span>
                                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                                           {mat.material_type?.replace('_', ' ')}
                                       </span>
                                   </div>
                                   <h3 className="text-xl font-bold text-slate-800 mt-2 line-clamp-1">{mat.title}</h3>
                                   <p className="text-slate-500 text-sm mt-2 line-clamp-2 h-10">{mat.description}</p>
                               </div>
                           </div>

                           <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                               <div className="flex items-center gap-2">
                                   <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-500">
                                       {mat.created_by?.charAt(0) || '?'}
                                   </div>
                                   <span className="text-xs text-slate-400 truncate w-24">{mat.created_by || 'Unknown'}</span>
                               </div>
                               {mat.material_type === 'document' ? (
                                   <button 
                                       onClick={() => setSelectedFile(fullLink)}
                                       className="flex items-center gap-1.5 text-green-600 font-bold text-sm hover:underline"
                                   >
                                       Read Only <BookOpen size={14}/>
                                   </button>
                               ) : (
                                   <a 
                                       href={fullLink} 
                                       target="_blank" 
                                       rel="noopener noreferrer"
                                       className="flex items-center gap-1.5 text-green-600 font-bold text-sm hover:underline"
                                   >
                                       {mat.material_type === 'local_video' || mat.material_type === 'youtube' ? (<>Watch <PlayCircle size={14}/></>) : 
                                        (<>Open Link <ExternalLink size={14}/></>)}
                                   </a>
                               )}
                           </div>
                        </div>
                    )})
                )}
            </div>

            {/* Read-Only Viewer Modal (Copyright Protection) */}
            {selectedFile && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/95 backdrop-blur-xl p-4 md:p-10 animate-in fade-in duration-300">
                    <div className="relative w-full h-full max-w-7xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col">
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 tracking-tight">Protected Document Viewer</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Copyright © Direct Access Syndicate</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedFile(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors flex items-center gap-2 text-slate-500 font-bold text-sm">
                                CLOSE <Plus size={24} className="rotate-45" />
                            </button>
                        </div>
                        <div className="flex-1 bg-slate-200 relative overflow-hidden" onContextMenu={(e) => e.preventDefault()}>
                            <iframe 
                                src={`${selectedFile}#toolbar=0&navpanes=0&scrollbar=1`} 
                                className="w-full h-full border-none pointer-events-auto"
                                title="Protected Content"
                            ></iframe>
                            {/* Decorative blocking overlay for the header area of common PDF viewers */}
                            <div className="absolute top-0 left-0 right-0 h-12 bg-transparent pointer-events-none z-50"></div>
                        </div>
                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-center text-center">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Bookmark size={14} className="text-green-500" /> This document is restricted for on-site reading only to protect intellectual property.
                             </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Resource Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <form onSubmit={handleCreate} className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h3 className="text-xl font-black text-slate-800 tracking-tight">Add New Resource</h3>
                            <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                                <Plus size={24} className="rotate-45 text-slate-500" />
                            </button>
                        </div>
                        <div className="p-8 space-y-5">
                            <div>
                                <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Resource Title</label>
                                <input 
                                    type="text" 
                                    required
                                    placeholder="e.g. Grade 10 Math Notes"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-green-500/20 transition-all font-medium"
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Description</label>
                                <textarea 
                                    rows="3"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-green-500/20 transition-all font-medium resize-none"
                                    placeholder="Brief summary of the material..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Target Level</label>
                                    <select 
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-green-500/20 transition-all font-medium"
                                        value={formData.level_target}
                                        onChange={(e) => setFormData({...formData, level_target: e.target.value})}
                                    >
                                        {levels.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Resource Type</label>
                                    <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200">
                                        <button 
                                            type="button" 
                                            onClick={() => setUploadType('link')}
                                            className={`flex-1 py-2 text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-colors ${uploadType === 'link' ? 'bg-white text-slate-800 shadow shadow-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            <LinkIcon size={16} /> URL
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => setUploadType('file')}
                                            className={`flex-1 py-2 text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-colors ${uploadType === 'file' ? 'bg-white text-slate-800 shadow shadow-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            <Upload size={16} /> File
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            {uploadType === 'link' ? (
                                <div>
                                    <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Content Link (URL or YouTube)</label>
                                    <input 
                                        type="url" 
                                        required={uploadType === 'link'}
                                        placeholder="https://drive.google.com/... or https://youtube.com/..."
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-green-500/20 transition-all font-medium"
                                        value={formData.content_link}
                                        onChange={(e) => setFormData({...formData, content_link: e.target.value})}
                                    />
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Upload File (PDF, Video, etc.)</label>
                                    <input 
                                        type="file" 
                                        required={uploadType === 'file'}
                                        onChange={(e) => setFile(e.target.files[0])}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-green-500/20 transition-all font-medium file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer"
                                    />
                                    {file && <p className="text-xs text-slate-500 mt-2 ml-1">Selected: {file.name}</p>}
                                </div>
                            )}
                        </div>
                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-4">
                            <button 
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl font-black hover:bg-slate-100 transition-all active:scale-95"
                            >
                                CANCEL
                            </button>
                            <button 
                                type="submit"
                                className="flex-1 py-4 bg-green-600 text-white rounded-2xl font-black hover:bg-green-700 transition-all active:scale-95 shadow-lg shadow-green-500/20"
                            >
                                ADD RESOURCE
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default Learning;
