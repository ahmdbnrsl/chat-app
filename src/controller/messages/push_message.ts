import mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';
import { messages } from '@/models/messages';
import { users } from '@/models/users';
import type { User, Message, M } from '@/types';

const URI: string = process.env.NEXT_PUBLIC_MONGODB_URI || '';

export const pushMessage = async (
    messageOptions: M['SendMessage']
): Promise<M['IsMessage'] | false> => {
    try {
        await mongoose.connect(URI);
        if (messageOptions.receiver_id !== messageOptions.sender_id) {
            const checkExistingReceiver: User | null = await users.findOne({
                user_id: messageOptions.receiver_id
            });
            const checkExistingSender: User | null = await users.findOne({
                user_id: messageOptions.sender_id
            });
            if (checkExistingReceiver && checkExistingSender) {
                messageOptions.message_id = uuid();
                if ('secret' in messageOptions) delete messageOptions.secret;
                const res: Message = await messages.create(messageOptions);
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
