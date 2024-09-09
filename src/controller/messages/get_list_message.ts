import mongoose from 'mongoose';
import { messages } from '@/models/messages';
import type { Message, M } from '@/types';

const URI: string = process.env.MONGODB_URI || '';

export const getListMessage = async ({
    sender_id,
    receiver_id
}: M['GetListMessage']): Promise<M['ListMessage'] | false> => {
    try {
        await mongoose.connect(URI);
        const result: Array<Message> = await messages.find({
            $or: [
                { sender_id, receiver_id },
                { sender_id: receiver_id, receiver_id: sender_id }
            ]
        });
        if (result.length !== 0) {
            return {
                status: true,
                message:
                    'Succes get list message total message : ' + result.length,
                result
            };
        } else {
            return {
                status: true,
                message: 'no message found',
                result: []
            };
        }
    } catch (error) {
        console.error(error);
        return false;
    } finally {
        await mongoose.connection.close();
    }
};
