import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Controls = ({ toggleAudio, toggleVideo, shareScreen }) => {
    const [isAudioOn, setIsAudioOn] = useState(true);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const navigate = useNavigate();

    const handleAudio = () => {
        const state = toggleAudio();
        setIsAudioOn(state);
    };

    const handleVideo = () => {
        const state = toggleVideo();
        setIsVideoOn(state);
    };

    const handleScreenShare = async () => {
        const success = await shareScreen();
        if (success) {
            setIsScreenSharing(!isScreenSharing);
        }
    };

    const leaveRoom = () => {
        // Simple navigation to dashboard
        // The WebRTC cleanup handles the disconnects
        navigate('/dashboard');
    };

    return (
        <div className="h-20 bg-gray-900 border-t border-gray-800 flex items-center justify-center space-x-4 px-6 md:space-x-8">
            <button
                onClick={handleAudio}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 ${
                    isAudioOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'
                }`}
            >
                {/* SVG for Mic */}
                {isAudioOn ? (
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                        <line x1="17" y1="7" x2="7" y2="17" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
                    </svg>
                )}
            </button>

            <button
                onClick={handleVideo}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 ${
                    isVideoOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'
                }`}
            >
                {/* SVG for Video */}
                {isVideoOn ? (
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
                    </svg>
                )}
            </button>

            <button
                onClick={handleScreenShare}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 ${
                    isScreenSharing ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
            >
                {/* SVG for Screen share */}
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            </button>

            <button
                onClick={leaveRoom}
                className="w-16 h-12 rounded-xl flex items-center justify-center bg-red-600 hover:bg-red-700 transition focus:outline-none shadow-lg shadow-red-600/20"
            >
                {/* SVG for Call End */}
                <svg className="w-6 h-6 text-white transform rotate-135" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ transform: "rotate(135deg)" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
            </button>
        </div>
    );
};

export default Controls;
