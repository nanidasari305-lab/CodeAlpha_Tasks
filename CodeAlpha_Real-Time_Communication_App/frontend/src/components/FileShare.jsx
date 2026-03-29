import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const FileShare = ({ roomId, socket }) => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const { user } = useContext(AuthContext);

    const fetchFiles = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            const { data } = await axios.get(`http://localhost:5000/api/files/${roomId}`, config);
            setFiles(data);
        } catch (err) {
            console.error('Error fetching files:', err);
        }
    };

    useEffect(() => {
        fetchFiles();

        if (socket) {
            // Re-fetch files if someone else uploads
            // We can emit a file-uploaded event from the uploader
            socket.on('file-uploaded', () => {
                fetchFiles();
            });
        }

        return () => {
            if (socket) socket.off('file-uploaded');
        };
    }, [roomId, socket]);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Basic validation
        if (file.size > 10 * 1024 * 1024) {
            setError('File size must be less than 10MB');
            return;
        }

        setError('');
        setUploading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('roomId', roomId);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`
                }
            };

            await axios.post('http://localhost:5000/api/files/upload', formData, config);
            
            if (socket) {
                socket.emit('file-uploaded', roomId);
            }
            fetchFiles();
        } catch (err) {
            setError(err.response?.data?.message || 'Error uploading file');
        } finally {
            setUploading(false);
        }
    };

    const formatBytes = (bytes, decimals = 2) => {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    };

    return (
        <div className="flex flex-col h-full bg-gray-950">
            <div className="p-4 border-b border-gray-800 bg-gray-900">
                <label className="flex items-center justify-center w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl cursor-pointer transition shadow-lg shadow-blue-500/20">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    {uploading ? 'Uploading...' : 'Share a File'}
                    <input 
                        type="file" 
                        className="hidden" 
                        onChange={handleFileUpload} 
                        disabled={uploading}
                    />
                </label>
                {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}
                <p className="text-gray-500 text-xs mt-2 text-center">Max size: 10MB</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {files.length === 0 ? (
                    <div className="text-center text-gray-500 mt-10 text-sm">
                        No files shared in this room yet.
                    </div>
                ) : (
                    files.map((file) => (
                        <div key={file._id} className="bg-gray-800 p-3 rounded-xl border border-gray-700 flex items-center justify-between group hover:border-gray-600 transition">
                            <div className="flex items-center flex-1 min-w-0 mr-4">
                                <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center mr-3 shrink-0">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-white truncate" title={file.fileName}>
                                        {file.fileName}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {formatBytes(file.size)} • By {file.uploaderName}
                                    </p>
                                </div>
                            </div>
                            <a 
                                href={`http://localhost:5000${file.fileUrl}`} 
                                download={file.fileName}
                                target="_blank"
                                rel="noreferrer"
                                className="w-8 h-8 rounded-lg bg-gray-700 hover:bg-blue-600 flex items-center justify-center text-gray-300 hover:text-white transition shrink-0"
                                title="Download"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                            </a>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default FileShare;
