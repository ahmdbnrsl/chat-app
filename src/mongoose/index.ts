import mongoose, { Schema, Document, Model } from 'mongoose';
import type { User, OTP, Message, MessageQuoted } from '@/types';

export class Models {
    get users(): Model<User> {
        const UserSchema: Schema<User> = new Schema({
            user_id: { type: String, required: true },
            wa_number: { type: String, required: true },
            name: { type: String, required: true },
            created_at: { type: String, required: true },
            update_at: { type: String, required: true },
            role: { type: String, required: true },
            pp: { type: String, required: true }
        });
        return mongoose.model<User>('users', UserSchema);
    }

    get otps(): Model<OTP> {
        const OTPSchema: Schema<OTP> = new Schema({
            wa_number: { type: String, required: true },
            otp_code: { type: String, required: true },
            created_at: { type: String, required: true },
            expired_at: { type: String, required: true }
        });
        return mongoose.model<OTP>('otps', OTPSchema);
    }

    get messages(): Model<Message> {
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
            message_quoted: { type: MessageQuotedSchema, required: false }
        });
        return mongoose.model<Message>('messages', MessageSchema);
    }
}
