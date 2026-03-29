import { useEffect, useRef } from 'react';

const VideoPlayer = ({ stream, isLocal, username }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    return (
        <div className="relative group bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-800 aspect-video flex-grow">
            {stream ? (
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted={isLocal}
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                    <span className="text-gray-500 font-medium">No Video</span>
                </div>
            )}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-sm font-medium text-white max-w-full truncate shadow-sm">
                    {username} {isLocal ? '(You)' : ''}
                </div>
            </div>
        </div>
    );
};

const VideoGrid = ({ localStream, remoteStreams, user }) => {
    return (
        <div className="flex-1 p-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-max h-full overflow-y-auto">
            <VideoPlayer stream={localStream} isLocal={true} username={user?.username || 'Local'} />
            
            {Object.entries(remoteStreams).map(([userId, stream]) => (
                <VideoPlayer key={userId} stream={stream} isLocal={false} username={`Remote User`} />
            ))}
        </div>
    );
};

export default VideoGrid;
