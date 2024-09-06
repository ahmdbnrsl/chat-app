import mongoose, { Schema, Model } from 'mongoose';
import type { User, OTP, Message, MessageQuoted } from '@/types';

class Models {
    private static _instance: Models | null = null;

    private constructor() {}

    static get instance(): Models {
        if (!this._instance) {
            this._instance = new Models();
        }
        return this._instance;
    }

    get users(): Model<User> {
        if (mongoose.models.users) {
            return mongoose.model<User>('users');
        }
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
        if (mongoose.models.otps) {
            return mongoose.model<OTP>('otps');
        }
        const OTPSchema: Schema<OTP> = new Schema({
            wa_number: { type: String, required: true },
            otp_code: { type: String, required: true },
            created_at: { type: String, required: true },
            expired_at: { type: String, required: true }
        });
        return mongoose.model<OTP>('otps', OTPSchema);
    }

    get messages(): Model<Message> {
        if (mongoose.models.messages) {
            return mongoose.model<Message>('messages');
        }
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

export const { users, otps, messages } = Models.instance;
