const mongoose = require('./db');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    user: String,
    text: String,
    created_at: { type: Date, default: Date.now, index: true }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;