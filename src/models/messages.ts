import mongoose, { Schema, Document, Model } from 'mongoose';

export interface Message extends Document {
    message_id: string;
    sender_id: string;
    receiver_id: string;
    message_text: string;
    message_timestamp: string;
}
const MessageSchema: Schema<Message> = new Schema({
    message_id: {
        type: String,
        required: true
    },
    sender_id: {
        type: String,
        required: true
    },
    receiver_id: {
        type: String,
        required: true
    },
    message_text: {
        type: String,
        required: true
    },
    message_timestamp: {
        type: String,
        required: true
    }
});
export const messages = mongoose.model('messages', MessageSchema);
