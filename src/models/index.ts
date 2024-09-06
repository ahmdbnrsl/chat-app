import mongoose, { Schema } from 'mongoose';
import type { TypeSchemas, TypeModels } from '@/types';

const Schemas: TypeSchemas = {
    UserSchema: new Schema({
        user_id: { type: String, required: true },
        wa_number: { type: String, required: true },
        name: { type: String, required: true },
        created_at: { type: String, required: true },
        update_at: { type: String, required: true },
        role: { type: String, required: true },
        pp: { type: String, required: true }
    }),

    OTPSchema: new Schema({
        wa_number: { type: String, required: true },
        otp_code: { type: String, required: true },
        created_at: { type: String, required: true },
        expired_at: { type: String, required: true }
    }),

    MessageQuotedSchema: new Schema({
        message_text: { type: String, required: false },
        from_name: { type: String, required: false },
        message_id: { type: String, required: false }
    }),

    MessageSchema: new Schema({
        message_id: { type: String, required: true },
        sender_id: { type: String, required: true },
        receiver_id: { type: String, required: true },
        message_text: { type: String, required: true },
        message_timestamp: { type: String, required: true },
        message_quoted: { type: Schemas.MessageQuotedSchema, required: false }
    })
};

const Models: TypeModels = {
    users: mongoose.model('users', Schemas.UserSchema),
    otps: mongoose.model('otps', Schemas.OTPSchema),
    messages: mongoose.model('messages', Schemas.MessageSchema)
};

export const { users, otps, messages } = Models;
