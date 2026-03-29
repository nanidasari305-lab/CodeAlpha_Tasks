import { useEffect, useState, useRef, useCallback } from 'react';

const useWebRTC = (socket, roomId, user) => {
    const [localStream, setLocalStream] = useState(null);
    const [remoteStreams, setRemoteStreams] = useState({});
    const peersRef = useRef({});

    // Configuration for STUN servers
    const config = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:global.stun.twilio.com:3478' }
        ]
    };

    const getMediaParams = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);
            return stream;
        } catch (error) {
            console.error('Error accessing media devices.', error);
            return null;
        }
    }, []);

    const createPeer = useCallback((userId, targetSocketId, stream) => {
        const peer = new RTCPeerConnection(config);
        
        // Add local stream tracks to peer
        if (stream) {
            stream.getTracks().forEach(track => peer.addTrack(track, stream));
        }

        // Handle receiving remote tracks
        peer.ontrack = (event) => {
            setRemoteStreams(prev => ({
                ...prev,
                [userId]: event.streams[0]
            }));
        };

        // Handle ice candidates
        peer.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('ice-candidate', {
                    target: targetSocketId,
                    candidate: event.candidate,
                    sender: socket.id
                });
            }
        };

        return peer;
    }, [socket]);

    useEffect(() => {
        if (!socket || !roomId || !user) return;

        let myStream;

        const initialize = async () => {
            myStream = await getMediaParams();
            socket.emit('join-room', roomId, user._id, user.username);
        };

        initialize();

        // When a new user connects
        socket.on('user-connected', async (userId, userName, targetSocketId) => {
            console.log('User connected:', userName);
            const peer = createPeer(userId, targetSocketId, localStream || myStream);
            peersRef.current[targetSocketId] = peer;

            const offer = await peer.createOffer();
            await peer.setLocalDescription(offer);

            socket.emit('offer', {
                target: targetSocketId,
                caller: socket.id,
                userId: user._id,
                userName: user.username,
                offer: peer.localDescription
            });
        });

        // When receiving an offer
        socket.on('offer', async (payload) => {
            const peer = createPeer(payload.userId, payload.caller, localStream || myStream);
            peersRef.current[payload.caller] = peer;

            await peer.setRemoteDescription(new RTCSessionDescription(payload.offer));
            const answer = await peer.createAnswer();
            await peer.setLocalDescription(answer);

            socket.emit('answer', {
                target: payload.caller,
                caller: socket.id,
                answer: peer.localDescription
            });
        });

        // When receiving an answer
        socket.on('answer', async (payload) => {
            const peer = peersRef.current[payload.caller];
            if (peer) {
                await peer.setRemoteDescription(new RTCSessionDescription(payload.answer));
            }
        });

        // When receiving an ICE candidate
        socket.on('ice-candidate', async (payload) => {
            const peer = peersRef.current[payload.sender];
            if (peer && payload.candidate) {
                try {
                    await peer.addIceCandidate(new RTCIceCandidate(payload.candidate));
                } catch (e) {
                    console.error('Error adding received ice candidate', e);
                }
            }
        });

        // When user disconnects
        socket.on('user-disconnected', (userId, targetSocketId) => {
            if (peersRef.current[targetSocketId]) {
                peersRef.current[targetSocketId].close();
                delete peersRef.current[targetSocketId];
            }
            setRemoteStreams(prev => {
                const updated = { ...prev };
                delete updated[userId];
                return updated;
            });
        });

        return () => {
            myStream?.getTracks().forEach(track => track.stop());
            Object.values(peersRef.current).forEach(peer => peer.close());
            socket.off('user-connected');
            socket.off('offer');
            socket.off('answer');
            socket.off('ice-candidate');
            socket.off('user-disconnected');
        };
    }, [socket, roomId, user, createPeer, getMediaParams]);

    const toggleAudio = () => {
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                return audioTrack.enabled;
            }
        }
        return false;
    };

    const toggleVideo = () => {
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                return videoTrack.enabled;
            }
        }
        return false;
    };

    const shareScreen = async () => {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({ cursor: true });
            const screenTrack = screenStream.getTracks()[0];

            setLocalStream(prevStream => {
                const newStream = new MediaStream([
                    screenTrack,
                    prevStream.getAudioTracks()[0]
                ]);
                return newStream;
            });

            // Replace track for all peers
            Object.values(peersRef.current).forEach(peer => {
                const sender = peer.getSenders().find(s => s.track.kind === 'video');
                if (sender) {
                    sender.replaceTrack(screenTrack);
                }
            });

            // When screen sharing is stopped using browser UI
            screenTrack.onended = async () => {
                const webcamStream = await navigator.mediaDevices.getUserMedia({ video: true });
                const webcamTrack = webcamStream.getVideoTracks()[0];
                
                setLocalStream(prevStream => {
                    const newStream = new MediaStream([
                        webcamTrack,
                        prevStream.getAudioTracks()[0]
                    ]);
                    return newStream;
                });

                Object.values(peersRef.current).forEach(peer => {
                    const sender = peer.getSenders().find(s => s.track.kind === 'video');
                    if (sender) {
                        sender.replaceTrack(webcamTrack);
                    }
                });
            };

            return true;
        } catch (error) {
            console.error('Error sharing screen:', error);
            return false;
        }
    };

    return { localStream, remoteStreams, toggleAudio, toggleVideo, shareScreen };
};

export default useWebRTC;
