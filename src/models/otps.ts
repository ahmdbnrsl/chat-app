import mongoose, { Schema, Document, Model } from 'mongoose';
import type { OTP } from '@/types';

const OTPSchema: Schema<OTP> = new Schema({
    wa_number: {
        type: String,
        required: true
    },
    otp_code: {
        type: String,
        required: true
    },
    created_at: {
        type: String,
        required: true
    },
    expired_at: {
        type: String,
        required: true
    }
});
export const otps = mongoose.model('otps', OTPSchema);
