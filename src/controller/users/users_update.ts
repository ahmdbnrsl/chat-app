import mongoose, { Document } from 'mongoose';
import { users } from '@/models/users';
import type { UpdateResult } from 'mongodb';
import type { User, U } from '@/types';

const URI: string = process.env.MONGODB_URI || '';

export const editUser = async ({
    new_name,
    new_pp,
    user_id,
    update_at
}: U['EditUser']): Promise<{ status: boolean; message: string } | false> => {
    try {
        await mongoose.connect(URI);
        const existingUser: User | null = await users.findOne({ user_id });
        if (existingUser) {
            const updateUser: UpdateResult<Document> = (await users.updateOne(
                { user_id },
                {
                    $set: {
                        name: new_name || existingUser.name,
                        update_at,
                        pp: new_pp || existingUser.pp
                    }
                },
                { new: true }
            )) as UpdateResult<Document>;
            if (updateUser?.acknowledged) {
                return {
                    status: true,
                    message: 'succes updating user'
                };
            } else {
                return {
                    status: false,
                    message: 'failed to update user'
                };
            }
        } else {
            return {
                status: false,
                message: 'cannot find user'
            };
        }
    } catch (error) {
        console.error(error);
        return false;
    } finally {
        await mongoose.connection.close();
    }
};
