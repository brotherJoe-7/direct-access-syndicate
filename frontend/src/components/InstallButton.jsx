import React from 'react';
import { Download, HelpCircle, X } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';

const InstallButton = ({ className = "" }) => {
    const { isInstallable, install } = usePWA();
    const [showHelp, setShowHelp] = React.useState(false);

    // If already installed or browser hasn't fired prompt yet, 
    // we show a subtle "Need Help Installing?" link instead for some browsers.
    if (!isInstallable) {
        return (
            <div className="relative inline-block">
                <button 
                    onClick={() => setShowHelp(!showHelp)}
                    className={`text-[10px] text-slate-400 hover:text-green-500 font-bold flex items-center gap-1 transition-colors uppercase tracking-widest ${className}`}
                >
                    <HelpCircle size={10} /> Need Help Installing?
                </button>
                
                {showHelp && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-72 p-5 bg-slate-900 text-white rounded-[2rem] shadow-2xl border border-slate-700 z-[100] text-xs leading-relaxed animate-fade-in ring-4 ring-slate-900/50">
                        <button onClick={() => setShowHelp(false)} className="absolute top-3 right-3 text-slate-500 hover:text-white"><X size={16} /></button>
                        <p className="font-black mb-4 text-green-400 uppercase tracking-widest text-[10px]">Installation Guide</p>
                        
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                                </div>
                                <div className="space-y-1">
                                    <p className="font-bold text-white">Android / Chrome</p>
                                    <p className="text-slate-400">Tap the <strong className="text-white">3 dots</strong> in the top corner and select <strong className="text-green-400">"Install App"</strong>.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                                </div>
                                <div className="space-y-1">
                                    <p className="font-bold text-white">iPhone (Safari)</p>
                                    <p className="text-slate-400">Tap the <strong className="text-white">Share icon</strong> (square with arrow) and scroll to <strong className="text-green-400">"Add to Home Screen"</strong>.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                                    <div className="w-4 h-4 rounded-full border-2 border-green-500 flex items-center justify-center text-[10px] font-black">+</div>
                                </div>
                                <div className="space-y-1">
                                    <p className="font-bold text-white">Computer / PC</p>
                                    <p className="text-slate-400">Click the <strong className="text-white">⊕ icon</strong> in your top address bar to install.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <button
            onClick={install}
            className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl font-bold shadow-xl shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all ${className}`}
        >
            <div className="bg-green-600 rounded-lg p-1">
                <Download size={16} />
            </div>
            <span>Install Direct Access App</span>
        </button>
    );
};

export default InstallButton;
