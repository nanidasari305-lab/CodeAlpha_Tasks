const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true,
    },
    fileUrl: {
        type: String,
        required: true,
    },
    roomId: {
        type: String,
        required: true,
    },
    uploaderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    uploaderName: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        required: true,
    }
}, { timestamps: true });

const File = mongoose.model('File', fileSchema);
module.exports = File;
