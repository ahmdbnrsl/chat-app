import type { DeleteResult } from 'mongodb';
import type { User, OTP, O } from '@/types';
import mongoose from 'mongoose';
import { compare } from 'bcrypt';
import { otps } from '@/models/otps';
import { users } from '@/models/users';

const URI: string = process.env.NEXT_PUBLIC_MONGODB_URI || '';

export const authOTP = async ({
    wa_number,
    otp_code,
    timestamp
}: O['AuthOTPCode']): Promise<O['IsAuthOTPCode'] | false> => {
    try {
        await mongoose.connect(URI);
        wa_number = wa_number?.startsWith('0')
            ? wa_number?.replace(/\D/g, '').replace('0', '62')
            : wa_number?.replace(/\D/g, '');
        const checkExistingOTP: OTP | null = await otps.findOne({ wa_number });
        if (checkExistingOTP) {
            const checkExpireOTP = checkExistingOTP?.expired_at >= timestamp;
            if (checkExpireOTP) {
                const compareOTP = await compare(
                    otp_code,
                    checkExistingOTP?.otp_code
                );
                if (compareOTP) {
                    await otps.deleteOne({
                        wa_number
                    });
                    const user: User | null = await users.findOne({
                        wa_number
                    });
                    return {
                        user,
                        status: true,
                        message: 'OTP is Valid'
                    };
                } else {
                    return {
                        status: false,
                        message: "OTP isn't Valid"
                    };
                }
            } else {
                const deleteExpireOTP: DeleteResult = await otps.deleteOne({
                    wa_number
                });
                return {
                    status: false,
                    message: 'OTP is Expired, please request again'
                };
            }
        } else {
            return {
                status: false,
                message: 'OTP is not found, please request again'
            };
        }
    } catch (error) {
        return false;
    } finally {
        await mongoose.connection.close();
    }
};
