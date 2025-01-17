const express = require('express');
require('dotenv').config();
const bcrypt = require('bcrypt');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const ConnectDB = require('./mongodb');
const MessageSchema = require('./models/Message'); // Assuming you have a Message model

// Initialize Express and HTTP Server
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', // Your React frontend
        credentials: true, // Allow credentials (cookies) to be sent
    },
});

// Middleware
app.use(express.json());
app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    })
);

// Connect to MongoDB
ConnectDB();

// User Schema
const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    password: String,
});
const UserSchema = mongoose.model('professors', userSchema);

// Student Schema
const studentSchema = new mongoose.Schema({
    name: String,
    username: String,
    password: String,
});
const StudentSchema = mongoose.model('students', studentSchema);

// Chat Rooms Map (In-memory storage of active users and their rooms)
const activeRooms = new Map();

// Socket.IO Events
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_room', ({ roomName }) => {
        console.log(`User joined room: ${roomName}`);
        socket.join(roomName);
    });

    socket.on('send_message', (data) => {
        console.log('Message received:', data);
        io.to(data.roomName).emit('receive_message', data);
    });
});


// REST API Endpoints
app.post('/register', async (req, res) => {
    const { name, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newuser = new UserSchema({ name, username, password: hashedPassword });
    await newuser.save();

    return res.json({ message: 'added successfully' });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const professor = await UserSchema.findOne({ username });
    try {
        if (!professor) {
            return res.json({ message: 'User not found' });
        }

        const isPassword = await bcrypt.compare(password, professor.password);
        if (!isPassword) {
            return res.json({ message: 'Incorrect password' });
        }
        return res.json({ message: 'valid', userdata: professor });
    } catch (error) {
        return res.json({ message: 'error' });
    }
});

app.post('/studentregister', async (req, res) => {
    const { name, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newuser = new StudentSchema({
        name,
        username,
        password: hashedPassword,
    });
    await newuser.save();

    return res.json({ message: 'added successfully' });
});

app.post('/studentlogin', async (req, res) => {
    const { username, password } = req.body;
    const student = await StudentSchema.findOne({ username });
    try {
        if (!student) {
            return res.json({ message: 'User not found' });
        }

        const isPassword = await bcrypt.compare(password, student.password);
        if (!isPassword) {
            return res.json({ message: 'Incorrect password' });
        }
        return res.json({ message: 'valid', userdata: student });
    } catch (error) {
        return res.json({ message: 'error' });
    }
});

// Fetch all messages for a specific chat room
app.get('/messages/:roomId', async (req, res) => {
    const { roomId } = req.params;

    try {
        const messages = await MessageSchema.find({ roomId }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch messages' });
    }
});

// Fetch all teachers
app.get('/teachers', async (req, res) => {
    try {
        const teachers = await UserSchema.find({});
        res.json(teachers);       
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch teachers' });
        console.log('no teachers');
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
