const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./backend/models/User');
const Post = require('./backend/models/Post');
const Comment = require('./backend/models/Comment');

dotenv.config({ path: './backend/.env' });

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected for Seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Post.deleteMany({});
        await Comment.deleteMany({});

        // Create Users
        const salt = await bcrypt.genSalt(10);
        const hashedPw = await bcrypt.hash('password123', salt);

        const users = await User.insertMany([
            { username: 'john_doe', email: 'john@example.com', password: hashedPw, bio: 'Hello, I am John!' },
            { username: 'jane_smith', email: 'jane@example.com', password: hashedPw, bio: 'Just vibing.' },
            { username: 'alex_cool', email: 'alex@example.com', password: hashedPw, bio: 'Tech enthusiast.' }
        ]);

        console.log('Users inserted');

        // Make John follow Jane and Alex
        users[0].following.push(users[1]._id, users[2]._id);
        users[1].followers.push(users[0]._id);
        users[2].followers.push(users[0]._id);

        await users[0].save();
        await users[1].save();
        await users[2].save();

        // Create Posts
        const posts = await Post.insertMany([
            { userId: users[1]._id, content: 'This is my first post on this awesome new platform!', likes: [users[0]._id] },
            { userId: users[2]._id, content: 'Does anyone know when the new tech conference starts?', likes: [users[0]._id, users[1]._id] },
            { userId: users[0]._id, content: 'Having a great day coding! 🚀', likes: [] }
        ]);

        console.log('Posts inserted');

        // Create Comments
        await Comment.insertMany([
            { postId: posts[0]._id, userId: users[0]._id, text: 'Welcome to the platform, Jane!' },
            { postId: posts[1]._id, userId: users[1]._id, text: 'I think it is next week!' }
        ]);

        console.log('Comments inserted');
        console.log('Seeding COMPLETE! You can now log in with email: john@example.com / pw: password123');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedDB();
