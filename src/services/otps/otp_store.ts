import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { OTP, otps } from '@/models/otps';
import { User, users } from '@/models/users';

const URI: string = process.env.NEXT_PUBLIC_MONGODB_URI || '';

export const storeOTP = async ({
    wa_number,
    otp_code,
    created_at,
    expired_at
}: {
    wa_number: string;
    otp_code: string;
    created_at: string;
    expired_at: string;
}): Promise<{ result?: OTP; status: boolean; message?: string } | false> => {
    try {
        await mongoose.connect(URI);
        wa_number = wa_number?.startsWith('0')
            ? wa_number?.replace(/\D/g, '').replace('0', '62')
            : wa_number?.replace(/\D/g, '');
        const checkExistingUser: User | null = await users.findOne({
            wa_number
        });
        if (checkExistingUser) {
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
                    otp_code: await bcrypt.hash(otp_code, 10),
                    created_at,
                    expired_at
                });
                return { result, status: true };
            }
        } else {
            return {
                status: false,
                message: 'User is not registered'
            };
        }
    } catch (error) {
        return false;
    } finally {
        await mongoose.connection.close();
    }
};
