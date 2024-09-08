import mongoose, { Schema, Document, Model } from 'mongoose';
import type { Message, MessageQuoted } from '@/types';

const MessageQuotedSchema: Schema<MessageQuoted> = new Schema({
    message_text: { type: String, required: false },
    from_name: { type: String, required: false },
    message_id: { type: String, required: false }
});

const MessageSchema: Schema<Message> = new Schema({
    message_id: { type: String, required: true },
    sender_id: { type: String, required: true },
    receiver_id: { type: String, required: true },
    message_text: { type: String, required: true },
    message_timestamp: { type: String, required: true },
    is_readed: { type: Boolean, required: true },
    read_at: { type: String, required: false },
    message_quoted: { type: MessageQuotedSchema, required: false }
});
export const messages = mongoose.model('messages', MessageSchema);
