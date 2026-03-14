import React from 'react';
import { Download } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';

const InstallButton = ({ className = "" }) => {
    const { isInstallable, install } = usePWA();

    if (!isInstallable) return null;

    return (
        <button
            onClick={install}
            className={`flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-95 ${className}`}
        >
            <Download size={18} />
            <span>Install Direct Access App</span>
        </button>
    );
};

export default InstallButton;
