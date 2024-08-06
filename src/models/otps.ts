import mongoose, { Schema, Document, Model } from 'mongoose';

export interface OTP extends Document {
    wa_number: string;
    otp_code: string;
    created_at: string;
    expired_at: string;
}
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
