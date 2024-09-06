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
        return (
            mongoose.models.users ||
            mongoose.model<User>('users', this.UserSchema)
        );
    }

    get otps(): Model<OTP> {
        return (
            mongoose.models.otps || mongoose.model<OTP>('otps', this.OTPSchema)
        );
    }

    get messages(): Model<Message> {
        return (
            mongoose.models.messages ||
            mongoose.model<Message>('messages', this.MessageSchema)
        );
    }

    private get UserSchema(): Schema<User> {
        return new Schema({
            user_id: { type: String, required: true },
            wa_number: { type: String, required: true },
            name: { type: String, required: true },
            created_at: { type: String, required: true },
            update_at: { type: String, required: true },
            role: { type: String, required: true },
            pp: { type: String, required: true }
        });
    }

    private get OTPSchema(): Schema<OTP> {
        return new Schema({
            wa_number: { type: String, required: true },
            otp_code: { type: String, required: true },
            created_at: { type: String, required: true },
            expired_at: { type: String, required: true }
        });
    }

    private get MessageSchema(): Schema<Message> {
        const MessageQuotedSchema: Schema<MessageQuoted> = new Schema({
            message_text: { type: String, required: false },
            from_name: { type: String, required: false },
            message_id: { type: String, required: false }
        });

        return new Schema({
            message_id: { type: String, required: true },
            sender_id: { type: String, required: true },
            receiver_id: { type: String, required: true },
            message_text: { type: String, required: true },
            message_timestamp: { type: String, required: true },
            message_quoted: { type: MessageQuotedSchema, required: false }
        });
    }
}

export const { users, otps, messages } = Models.instance;
