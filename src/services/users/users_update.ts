import mongoose from 'mongoose';
import { users, User, Document } from '@/models/users';
import { UpdateResult } from 'mongodb';

const URI: string = process.env.NEXT_PUBLIC_MONGODB_URI || '';

export const editUser = async ({
    new_name,
    new_pp,
    user_id
}: {
    new_name?: string;
    new_pp?: string;
    user_id: string;
}): Promise<{ status: boolean; message: string } | false> => {
    try {
        await mongoose.connect(URI);
        const existingUser: User | null = await users.findOne({ user_id });
        if (existingUser) {
            const updateUser: UpdateResult<Document> = await users.updateOne(
                { user_id },
                {
                    $set: {
                        name: new_name || existingUser.name,
                        pp: new_pp || existingUser.pp
                    }
                },
                { new: true }
            );
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
