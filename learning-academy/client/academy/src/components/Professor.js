import React, { useEffect, useState } from 'react';
import { useSocket } from './socket-provider';
import { useSelector } from 'react-redux';

const Professor = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const { userId } = useSelector((state) => state.student); // Current teacher ID
    const socket = useSocket();

    useEffect(() => {
        if (socket) {
            socket.emit('join_room', { roomId: userId });

            socket.on('receive_message', (message) => {
                setMessages((prev) => [...prev, message]);
            });
        }
    }, [socket, userId]);

    const sendMessage = (receiverId) => {
        if (newMessage.trim()) {
            const roomId = `${receiverId}-${userId}`;
            socket.emit('send_message', {
                roomId,
                senderId: userId,
                receiverId,
                message: newMessage,
            });
            setNewMessage('');
        }
    };

    return (
        <div>
            <h2>Teacher Chat</h2>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.senderId === userId ? 'You' : 'Student'}:</strong> {msg.message}
                        {msg.senderId !== userId && (
                            <div>
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Reply"
                                />
                                <button onClick={() => sendMessage(msg.senderId)}>Reply</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Professor;
