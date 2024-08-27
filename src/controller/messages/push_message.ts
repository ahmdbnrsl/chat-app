import mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';
import { messages } from '@/models/messages';
import { users } from '@/models/users';
import type { User, Message, M } from '@/types';

const URI: string = process.env.NEXT_PUBLIC_MONGODB_URI || '';

export const pushMessage = async ({
    sender_id,
    receiver_id,
    message_text,
    message_timestamp
}: M['SendMessage']): Promise<M['IsMessage'] | false> => {
    try {
        await mongoose.connect(URI);
        if (receiver_id !== sender_id) {
            const checkExistingReceiver: User | null = await users.findOne({
                user_id: receiver_id
            });
            const checkExistingSender: User | null = await users.findOne({
                user_id: sender_id
            });
            if (checkExistingReceiver && checkExistingSender) {
                let message_id: string = uuid();
                const res: Message = await messages.create({
                    message_id,
                    sender_id,
                    receiver_id,
                    message_text,
                    message_timestamp
                });
                return {
                    result: res,
                    status: true,
                    message: 'success push message to database'
                };
            } else {
                return {
                    status: false,
                    message: 'Sender and receiver both must be registered'
                };
            }
        } else {
            return {
                status: false,
                message: 'Sender and receiver must not same'
            };
        }
    } catch (error) {
        return false;
    } finally {
        await mongoose.connection.close();
    }
};
