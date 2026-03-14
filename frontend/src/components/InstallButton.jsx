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
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-4 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-800 z-[100] text-xs leading-relaxed animate-fade-in">
                        <button onClick={() => setShowHelp(false)} className="absolute top-2 right-2 text-slate-500 hover:text-white"><X size={14} /></button>
                        <p className="font-bold mb-2 text-green-400">Manual Installation Guide:</p>
                        <ul className="space-y-2 list-disc pl-4 opacity-90">
                            <li><strong>iPhone (Safari):</strong> Tap "Share" icon (square with arrow) and select "Add to Home Screen".</li>
                            <li><strong>Android (Chrome):</strong> Tap the 3 dots in the corner and select "Install App" or "Add to Home Screen".</li>
                            <li><strong>PC (Chrome/Edge):</strong> Look for the ⊕ icon in your address bar.</li>
                        </ul>
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
