import mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Message, messages } from '@/models/messages';
import { User, users } from '@/models/users';

export const pushMessage = async ({
    sender_id,
    receiver_id,
    message_text,
    message_timestamp
}: {
    sender_id: string;
    receiver_id: string;
    message_text: string;
    message_timestamp: string;
}): Promise<{ result?: Message; status: boolean; message: string } | false> => {
    try {
        await mongoose.connect();
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
    } catch (error) {
        return false;
    } finally {
        await mongoose.connection.close();
    }
};
