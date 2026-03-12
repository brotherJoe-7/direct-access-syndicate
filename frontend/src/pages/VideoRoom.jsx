import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { ArrowLeft, VideoOff, MicOff, PhoneOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const VideoRoom = () => {
    const { roomName } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 z-[1000] bg-slate-900 flex flex-col">
            {/* Custom Header for the Call */}
            <div className="p-4 bg-slate-900 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => navigate('/community')}
                        className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h2 className="text-white font-bold text-lg">Group Call</h2>
                        <p className="text-white/40 text-[10px] items-center gap-1 uppercase tracking-widest font-bold">
                            Room: {roomName}
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-xs font-bold uppercase tracking-tighter">Live Session</span>
                </div>
            </div>

            {/* Jitsi Integrated Frame */}
            <div className="flex-1 relative bg-black">
                <JitsiMeeting
                    domain="meet.jit.si"
                    roomName={roomName}
                    configOverwrite={{
                        startWithAudioMuted: true,
                        disableModeratorIndicator: true,
                        startScreenSharing: false,
                        enableEmailInStats: false,
                        prejoinPageEnabled: false,
                        toolbarButtons: [
                            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                            'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
                            'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
                            'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
                            'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
                            'security'
                        ],
                    }}
                    interfaceConfigOverwrite={{
                        DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                        SHOW_JITSI_WATERMARK: false,
                        HIDE_DEEP_LINKING_LOGO: true,
                    }}
                    userInfo={{
                        displayName: user.name,
                        email: user.email
                    }}
                    onReadyToClose={() => navigate('/community')}
                    getIFrameRef={(iframeRef) => {
                        iframeRef.style.height = '100%';
                        iframeRef.style.width = '100%';
                    }}
                />
            </div>
            
            <div className="p-6 bg-slate-900 flex justify-center text-white/20 text-[10px] font-bold uppercase tracking-[0.2em] border-t border-white/5">
                Direct Access Syndicate Secure Channel
            </div>
        </div>
    );
};

export default VideoRoom;
