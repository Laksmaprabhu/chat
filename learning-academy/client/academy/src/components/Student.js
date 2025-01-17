import React, { useEffect, useState } from 'react';
import { useSocket } from './socket-provider'; // Custom hook for Socket.IO connection
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Student = () => {
    const { userId, username, email } = useSelector((state) => state.student); // Fetch student data from Redux
    const [teachers, setTeachers] = useState([]); // List of available teachers
    const [selectedTeacher, setSelectedTeacher] = useState(''); // Selected teacher ID
    const [messages, setMessages] = useState([]); // Chat messages
    const [newMessage, setNewMessage] = useState(''); // Input message text
    const socket = useSocket(); // Socket.IO instance

    // Fetch list of teachers from the backend
    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await fetch('http://localhost:5000/teachers');
                const data = await response.json();
                setTeachers(data); // Set teachers list
            } catch (error) {
                console.error('Error fetching teachers:', error);
            }
        };
        fetchTeachers();
    }, []);

    // Listen for incoming messages via Socket.IO
    useEffect(() => {
        if (socket) {
            socket.on('receive_message', (message) => {
                setMessages((prev) => [...prev, message]);
            });
        }

        return () => {
            if (socket) {
                socket.off('receive_message'); // Clean up listener
            }
        };
    }, [socket]);

    // Join chat room
    const joinChat = () => {
        if (!userId || !selectedTeacher) {
            console.error('User ID or Teacher ID is missing');
            return;
        }

        const roomName = `${userId}-${selectedTeacher}`;
        console.log('Joining room:', roomName);

        socket.emit('join_room', { roomName });
    };

    // Send message to the chat
    const sendMessage = () => {
        if (newMessage.trim() && userId && selectedTeacher) {
            const roomName = `${userId}-${selectedTeacher}`;
            const messageData = {
                roomName,
                senderId: userId,
                receiverId: selectedTeacher,
                message: newMessage,
            };

            socket.emit('send_message', messageData);
            setMessages((prev) => [...prev, messageData]); // Optimistically add the message to the UI
            setNewMessage(''); // Clear the input field
        }
    };

    return (
        <div>
            <h2>Student Chat</h2>
            <p>Welcome, {username} ({email})</p>

            {/* Teacher Selection */}
            <select onChange={(e) => setSelectedTeacher(e.target.value)}>
                <option value="">Select a Teacher</option>
                {teachers.map((teacher) => (
                    <option key={teacher._id} value={teacher._id}>
                        {teacher.name}
                    </option>
                ))}
            </select>
            <button onClick={joinChat} disabled={!selectedTeacher}>
                Join Chat
            </button>

            {/* Chat Messages */}
            <div>
                <h3>Messages</h3>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>
                            {msg.senderId === userId ? 'You' : 'Teacher'}:
                        </strong>{' '}
                        {msg.message}
                    </div>
                ))}
            </div>

            {/* Send Message */}
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message"
            />
            <button onClick={sendMessage} disabled={!newMessage.trim()}>
                Send
            </button>
            <Link to="/professor">Professor</Link>
        </div>
    );
};

export default Student;
