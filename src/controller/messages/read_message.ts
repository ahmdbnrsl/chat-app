import { messages } from '@/models/messages';
import mongoose from 'mongoose';
import type { UpdateResult } from 'mongodb';
import type { Message, M } from '@/types';

const URI: string = process.env.MONGODB_URI || '';

export const readMessage = async (
    paramOptions: M['ReadMessage']
): Promise<{ status: boolean; message: string } | false> => {
    try {
        await mongoose.connect(URI);
        const { sender_id, receiver_id } = paramOptions;
        const readedMessage = (await messages.updateMany(
            {
                sender_id,
                receiver_id,
                is_readed: false
            },
            {
                is_readed: true
            }
        )) as UpdateResult<Message>;
        if (readedMessage.acknowledged) {
            return {
                status: true,
                message: 'success read message'
            };
        } else {
            return { status: false, message: 'failed to read message' };
        }
    } catch (error) {
        console.error(error);
        return false;
    } finally {
        await mongoose.connection.close();
    }
};
