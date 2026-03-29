import { useState, useEffect, useRef } from 'react';

const Chat = ({ socket, roomId, user }) => {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (!socket) return;

        socket.on('receive-message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off('receive-message');
        };
    }, [socket]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (messageInput.trim() && socket) {
            const messageData = {
                roomId,
                senderId: user._id,
                senderName: user.username,
                text: messageInput,
                timestamp: new Date().toISOString(),
            };
            socket.emit('send-message', messageData);
            setMessageInput('');
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-950">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-10 text-sm">
                        No messages yet. Start the conversation!
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isMe = msg.senderId === user._id;
                        return (
                            <div key={index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                <span className="text-xs text-gray-400 mb-1 px-1">
                                    {isMe ? 'You' : msg.senderName} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <div className={`max-w-[85%] px-4 py-2 rounded-2xl ${
                                    isMe 
                                        ? 'bg-blue-600 text-white rounded-tr-none' 
                                        : 'bg-gray-800 text-gray-100 rounded-tl-none border border-gray-700'
                                }`}>
                                    <p className="text-sm break-words">{msg.text}</p>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>
            
            <div className="p-4 border-t border-gray-800 bg-gray-900">
                <form onSubmit={sendMessage} className="flex space-x-2">
                    <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 transition"
                    />
                    <button
                        type="submit"
                        disabled={!messageInput.trim()}
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl p-2.5 transition flex items-center justify-center shadow-lg shadow-blue-500/20"
                    >
                        <svg className="w-5 h-5 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;
