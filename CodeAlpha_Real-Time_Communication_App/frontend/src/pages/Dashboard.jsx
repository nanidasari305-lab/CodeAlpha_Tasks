import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [roomIdToJoin, setRoomIdToJoin] = useState('');
    const [newRoomName, setNewRoomName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleCreateRoom = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post('http://localhost:5000/api/rooms', { name: newRoomName }, config);
            navigate(`/room/${data.roomId}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create room');
        } finally {
            setLoading(false);
        }
    };

    const handleJoinRoom = async (e) => {
        e.preventDefault();
        setError('');
        if (!roomIdToJoin.trim()) return;
        
        setLoading(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            // Optional: verify room exists
            await axios.post('http://localhost:5000/api/rooms/join', { roomId: roomIdToJoin }, config);
            navigate(`/room/${roomIdToJoin}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to join room. Please check the ID.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 p-6">
            <nav className="max-w-6xl mx-auto flex justify-between items-center bg-gray-900 p-4 rounded-xl shadow-md border border-gray-800">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
                        {user?.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">WeMeet</h1>
                        <p className="text-xs text-gray-400">Welcome back, {user?.username}</p>
                    </div>
                </div>
                <button 
                    onClick={logout}
                    className="px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10 rounded-lg transition"
                >
                    Sign Out
                </button>
            </nav>

            <main className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Create Room Card */}
                <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/20 transition duration-500"></div>
                    <h2 className="text-2xl font-bold text-white mb-2">Create Meeting</h2>
                    <p className="text-gray-400 text-sm mb-6">Start a new secure meeting instantly</p>
                    
                    <form onSubmit={handleCreateRoom} className="space-y-4 relative z-10">
                        <input
                            type="text"
                            placeholder="Meeting Name (Optional)"
                            value={newRoomName}
                            onChange={(e) => setNewRoomName(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition shadow-lg shadow-blue-500/20 flex justify-center items-center"
                        >
                            {loading ? 'Creating...' : 'New Meeting'}
                        </button>
                    </form>
                </div>

                {/* Join Room Card */}
                <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-purple-500/20 transition duration-500"></div>
                    <h2 className="text-2xl font-bold text-white mb-2">Join Meeting</h2>
                    <p className="text-gray-400 text-sm mb-6">Enter a meeting ID to join</p>
                    
                    <form onSubmit={handleJoinRoom} className="space-y-4 relative z-10">
                        <input
                            type="text"
                            required
                            placeholder="Meeting ID"
                            value={roomIdToJoin}
                            onChange={(e) => setRoomIdToJoin(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-purple-500 transition"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition shadow-lg shadow-purple-500/20 flex justify-center items-center"
                        >
                            {loading ? 'Joining...' : 'Join Meeting'}
                        </button>
                    </form>
                </div>
            </main>

            {error && (
                <div className="max-w-4xl mx-auto mt-6 bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl text-center">
                    {error}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
