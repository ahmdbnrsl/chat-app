import mongoose from 'mongoose';
import { compare } from 'bcrypt';
import { DeleteResult } from 'mongodb';
import { otps, OTP } from '@/models/otps';

const URI: string = process.env.NEXT_PUBLIC_MONGODB_URI || '';

export const authOTP = async ({
    wa_number,
    otp_code,
    timestamp
}: {
    wa_number: string;
    otp_code: string;
    timestamp: string;
}): Promise<{ status: boolean; message: string } | false> => {
    try {
        await mongoose.connect(URI);
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

                    return {
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
