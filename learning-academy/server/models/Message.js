const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true }, // User who sent the message
  recipient: { type: String, required: true }, // User who receives the message
  message: { type: String, required: true }, // The message content
  timestamp: { type: Date, default: Date.now }, // When the message was sent
});

module.exports = mongoose.model('Message', messageSchema);

