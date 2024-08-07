import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { OTP, otps } from '@/models/otps';

const URI: string = process.env.NEXT_PUBLIC_MONGODB_URI || '';

export const storeOTP = async ({
    wa_number,
    otp_code,
    created_at,
    expired_at
}: {
    wa_number: string;
    otp_code?: string | undefined;
    created_at: string;
    expired_at: string;
}): Promise<{ result: OTP; status: boolean } | boolean> => {
    try {
        await mongoose.connect(URI);
        const checkExistingNumber: OTP | null = await otps.findOne({
            wa_number
        });
        if (!checkExistingNumber) {
            const result: OTP = await otps.create({
                wa_number,
                otp_code: await bcrypt.hash(otp_code, 10),
                created_at,
                expired_at
            });
            return { result, status: true };
        } else {
            await otps.deleteOne({ wa_number });
            const result: OTP = await otps.create({
                wa_number,
                otp_code: await bcrypt.hash(otp_code || '', 10),
                created_at,
                expired_at
            });
            return { result, status: true };
        }
    } catch (error) {
        return false;
    } finally {
        await mongoose.connection.close();
    }
};
