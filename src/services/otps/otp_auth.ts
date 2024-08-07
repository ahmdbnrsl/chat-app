import mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';
import { compare } from 'bcrypt';
import { DeleteResult } from 'mongodb';
import { users, User } from '@/models/users';
import { otps, OTP } from '@/models/otps';

const URI: string = process.env.NEXT_PUBLIC_MONGODB_URI || '';

export const authOTP = async ({
    name,
    wa_number,
    otp_code,
    timestamp
}: {
    name: string;
    wa_number: string;
    otp_code: string;
    timestamp: string;
}): Promise<{ result?: User; status: boolean; message: string } | false> => {
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
                    const user_id: string = uuid();
                    const storeUser: User = await users.create({
                        user_id,
                        wa_number,
                        name,
                        created_at: timestamp,
                        update_at: 'no_update'
                    });
                    return {
                        result: storeUser,
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
