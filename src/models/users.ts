import mongoose, { Schema, Document, Model } from 'mongoose';
import type { User } from '@/types';

const UserSchema: Schema<User> = new Schema({
    user_id: { type: String, required: true },
    wa_number: { type: String, required: true },
    name: { type: String, required: true },
    created_at: { type: String, required: true },
    update_at: { type: String, required: true },
    role: { type: String, required: true },
    pp: { type: String, required: true },
    status: { type: String, required: true }
});
export const users = mongoose.model('users', UserSchema);
