import { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SocketContext } from '../context/SocketContext';
import { AuthContext } from '../context/AuthContext';
import useWebRTC from '../hooks/useWebRTC';
import VideoGrid from '../components/VideoGrid';
import Controls from '../components/Controls';
import Chat from '../components/Chat';
import Whiteboard from '../components/Whiteboard';
import FileShare from '../components/FileShare';

const MeetingRoom = () => {
    const { roomId } = useParams();
    const socket = useContext(SocketContext);
    const { user } = useContext(AuthContext);
    
    const [activeSidebar, setActiveSidebar] = useState(null); // 'chat' or 'whiteboard' or null

    const {
        localStream,
        remoteStreams,
        toggleAudio,
        toggleVideo,
        shareScreen
    } = useWebRTC(socket, roomId, user);

    const toggleSidebar = (panel) => {
        if (activeSidebar === panel) {
            setActiveSidebar(null);
        } else {
            setActiveSidebar(panel);
        }
    };

    return (
        <div className="h-screen bg-black flex flex-col overflow-hidden">
            {/* Top Toolbar */}
            <div className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6 shrink-0 z-10 w-full relative">
                <div className="flex items-center space-x-4">
                    <span className="text-white font-bold text-lg hidden md:block">WeMeet Room</span>
                    <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-md text-sm font-mono tracking-wider border border-gray-700">
                        {roomId}
                    </span>
                    <button 
                        onClick={() => navigator.clipboard.writeText(roomId)}
                        className="text-blue-400 hover:text-blue-300 transition text-sm flex items-center"
                        title="Copy Room ID"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span className="hidden sm:inline">Copy</span>
                    </button>
                </div>

                <div className="flex items-center space-x-2">
                    <button 
                        onClick={() => toggleSidebar('chat')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-2 border
                            ${activeSidebar === 'chat' 
                                ? 'bg-blue-600/20 text-blue-400 border-blue-500/50' 
                                : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'}`}
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span className="hidden sm:inline">Chat</span>
                    </button>
                    
                    <button 
                        onClick={() => toggleSidebar('whiteboard')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-2 border
                            ${activeSidebar === 'whiteboard' 
                                ? 'bg-purple-600/20 text-purple-400 border-purple-500/50' 
                                : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'}`}
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        <span className="hidden sm:inline">Board</span>
                    </button>
                    
                    <button 
                        onClick={() => toggleSidebar('files')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-2 border
                            ${activeSidebar === 'files' 
                                ? 'bg-green-600/20 text-green-400 border-green-500/50' 
                                : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'}`}
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        <span className="hidden sm:inline">Files</span>
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden relative">
                
                {/* Video Grid */}
                <div className={`flex-1 flex flex-col transition-all duration-300 ${activeSidebar ? 'mr-0 md:mr-[400px]' : ''}`}>
                    <VideoGrid 
                        localStream={localStream}
                        remoteStreams={remoteStreams}
                        user={user}
                    />
                </div>

                {/* Sidebar (Chat / Whiteboard) */}
                <div className={`absolute top-0 right-0 bottom-0 w-full md:w-[400px] bg-gray-900 border-l border-gray-800 transition-transform duration-300 transform z-20 flex flex-col
                    ${activeSidebar ? 'translate-x-0' : 'translate-x-full'}`}
                >
                    <div className="h-14 border-b border-gray-800 flex items-center justify-between px-4 shrink-0 bg-gray-800/50">
                        <h3 className="text-white font-medium">
                            {activeSidebar === 'chat' && 'In-Call Messages'}
                            {activeSidebar === 'whiteboard' && 'Collaborative Board'}
                            {activeSidebar === 'files' && 'Shared Files'}
                        </h3>
                        <button onClick={() => toggleSidebar(null)} className="text-gray-400 hover:text-white">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto relative bg-gray-950">
                        {activeSidebar === 'chat' && <Chat socket={socket} roomId={roomId} user={user} />}
                        {activeSidebar === 'whiteboard' && <Whiteboard socket={socket} roomId={roomId} />}
                        {activeSidebar === 'files' && <FileShare socket={socket} roomId={roomId} />}
                        

                    </div>
                </div>
            </div>

            {/* Bottom Controls */}
            <Controls 
                toggleAudio={toggleAudio}
                toggleVideo={toggleVideo}
                shareScreen={shareScreen}
            />
        </div>
    );
};

export default MeetingRoom;
