import mongoose, { Schema, Document, Model } from 'mongoose';

export interface User extends Document {
    user_id: string;
    wa_number: string;
    name: string;
    created_at: string;
    update_at: string;
}
const UserSchema: Schema<User> = new Schema({
    user_id: {
        type: String,
        required: true
    },
    wa_number: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    created_at: {
        type: String,
        required: true
    },
    update_at: {
        type: String,
        required: true
    }
});
export const users = mongoose.model('users', UserSchema);
