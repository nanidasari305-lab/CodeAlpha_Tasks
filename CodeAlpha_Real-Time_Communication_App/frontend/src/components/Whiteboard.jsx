import { useEffect, useRef, useState } from 'react';

const Whiteboard = ({ socket, roomId }) => {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#3b82f6'); // Default blue
    const [brushSize, setBrushSize] = useState(3);

    const colors = [
        '#ffffff', // White
        '#ef4444', // Red
        '#f59e0b', // Yellow
        '#10b981', // Green
        '#3b82f6', // Blue
        '#8b5cf6', // Purple
        '#ec4899', // Pink
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        // Fix for HDPI displays
        const scale = window.devicePixelRatio || 1;
        canvas.width = canvas.parentElement.clientWidth * scale;
        canvas.height = canvas.parentElement.clientHeight * scale;
        
        const context = canvas.getContext('2d');
        context.scale(scale, scale);
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.strokeStyle = color;
        context.lineWidth = brushSize;
        contextRef.current = context;

        // Handle resize
        const handleResize = () => {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.drawImage(canvas, 0, 0);

            canvas.width = canvas.parentElement.clientWidth * scale;
            canvas.height = canvas.parentElement.clientHeight * scale;
            context.scale(scale, scale);
            context.lineCap = 'round';
            context.lineJoin = 'round';
            context.strokeStyle = color;
            context.lineWidth = brushSize;

            context.drawImage(tempCanvas, 0, 0, tempCanvas.width / scale, tempCanvas.height / scale);
        };

        window.addEventListener('resize', handleResize);

        if (socket) {
            socket.on('drawing', (data) => {
                const { x0, y0, x1, y1, color: drawColor, size } = data;
                drawLine(
                    x0 * canvas.width / scale,
                    y0 * canvas.height / scale,
                    x1 * canvas.width / scale,
                    y1 * canvas.height / scale,
                    drawColor,
                    size,
                    false
                );
            });
        }

        return () => {
            window.removeEventListener('resize', handleResize);
            if (socket) socket.off('drawing');
        };
    }, [socket]);

    // Update context when tool changes
    useEffect(() => {
        if (contextRef.current) {
            contextRef.current.strokeStyle = color;
            contextRef.current.lineWidth = brushSize;
        }
    }, [color, brushSize]);

    const startDrawing = (e) => {
        const { offsetX, offsetY } = getCoordinates(e);
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const finishDrawing = () => {
        contextRef.current.closePath();
        setIsDrawing(false);
    };

    const draw = (e) => {
        if (!isDrawing) return;

        const { offsetX, offsetY } = getCoordinates(e);
        
        // Save current pos to emit
        const prevX = contextRef.current.canvas.width; // Actually we need actual prev coords, let's keep it simple
        
        // This simple implementation emits current pos repeatedly
        // For better performance, we should keep track of last X,Y 
        // Real logic usually passes previous X, Y and current X, Y
    };

    // Advanced drawing with line emission
    let current = { x: 0, y: 0 };
    
    const onMouseDown = (e) => {
        setIsDrawing(true);
        current.x = e.nativeEvent.offsetX;
        current.y = e.nativeEvent.offsetY;
    };

    const onMouseUp = (e) => {
        if (!isDrawing) return;
        setIsDrawing(false);
        drawLine(current.x, current.y, e.nativeEvent.offsetX, e.nativeEvent.offsetY, color, brushSize, true);
    };

    const onMouseMove = (e) => {
        if (!isDrawing) return;
        drawLine(current.x, current.y, e.nativeEvent.offsetX, e.nativeEvent.offsetY, color, brushSize, true);
        current.x = e.nativeEvent.offsetX;
        current.y = e.nativeEvent.offsetY;
    };

    const getCoordinates = (e) => {
        if (e.touches && e.touches.length > 0) {
            const rect = canvasRef.current.getBoundingClientRect();
            return {
                offsetX: e.touches[0].clientX - rect.left,
                offsetY: e.touches[0].clientY - rect.top
            };
        }
        return {
            offsetX: e.nativeEvent.offsetX,
            offsetY: e.nativeEvent.offsetY
        };
    };

    const drawLine = (x0, y0, x1, y1, drawColor, size, emit) => {
        const ctx = contextRef.current;
        if (!ctx) return;

        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.strokeStyle = drawColor;
        ctx.lineWidth = size;
        ctx.stroke();
        ctx.closePath();

        // Restore context state
        ctx.strokeStyle = color;
        ctx.lineWidth = brushSize;

        if (!emit || !socket) return;

        const w = canvasRef.current.width / (window.devicePixelRatio || 1);
        const h = canvasRef.current.height / (window.devicePixelRatio || 1);

        socket.emit('drawing', {
            roomId,
            x0: x0 / w,
            y0: y0 / h,
            x1: x1 / w,
            y1: y1 / h,
            color: drawColor,
            size
        });
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = contextRef.current;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Optionally emit clear event
    };

    return (
        <div className="flex flex-col h-full bg-gray-950">
            {/* Toolbar */}
            <div className="p-3 border-b border-gray-800 bg-gray-900 flex flex-wrap gap-3 items-center justify-between shrink-0">
                <div className="flex space-x-2">
                    {colors.map((c) => (
                        <button
                            key={c}
                            onClick={() => setColor(c)}
                            className={`w-6 h-6 rounded-full border-2 transition ${
                                color === c ? 'border-white scale-110' : 'border-transparent hover:scale-110'
                            }`}
                            style={{ backgroundColor: c }}
                            title={c}
                        />
                    ))}
                    
                    <button
                        onClick={() => setColor('#111827')} // Eraser matches background roughly OR just set globalCompositeOperation
                        className={`w-6 h-6 rounded-full border-2 border-gray-600 bg-gray-950 flex items-center justify-center transition ${
                            color === '#111827' ? 'border-white' : 'hover:border-gray-400'
                        }`}
                        title="Eraser"
                    >
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <rect x="4" y="8" width="16" height="12" rx="2" strokeWidth={2} />
                            <path d="M8 8V6a2 2 0 012-2h4a2 2 0 012 2v2" strokeWidth={2} />
                        </svg>
                    </button>
                </div>
                
                <div className="flex items-center space-x-4">
                    <input
                        type="range"
                        min="1"
                        max="20"
                        value={brushSize}
                        onChange={(e) => setBrushSize(parseInt(e.target.value))}
                        className="w-24 accent-blue-500"
                    />
                    
                    <button 
                        onClick={clearCanvas}
                        className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md transition"
                    >
                        Clear
                    </button>
                </div>
            </div>

            {/* Canvas Container */}
            <div className="flex-1 overflow-hidden relative touch-none cursor-crosshair">
                <canvas
                    ref={canvasRef}
                    onMouseDown={onMouseDown}
                    onMouseUp={onMouseUp}
                    onMouseOut={onMouseUp}
                    onMouseMove={onMouseMove}
                    onTouchStart={(e) => {
                        const { offsetX, offsetY } = getCoordinates(e);
                        current.x = offsetX;
                        current.y = offsetY;
                        setIsDrawing(true);
                    }}
                    onTouchEnd={() => setIsDrawing(false)}
                    onTouchMove={(e) => {
                        if (!isDrawing) return;
                        e.preventDefault(); // Prevent scrolling
                        const { offsetX, offsetY } = getCoordinates(e);
                        drawLine(current.x, current.y, offsetX, offsetY, color, brushSize, true);
                        current.x = offsetX;
                        current.y = offsetY;
                    }}
                    className="w-full h-full bg-[#111827]"
                    style={{ touchAction: 'none' }}
                />
            </div>
        </div>
    );
};

export default Whiteboard;
