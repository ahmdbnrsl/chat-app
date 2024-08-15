import mongoose from 'mongoose';
import { Message, messages } from '@/models/messages';

const URI: string = process.env.NEXT_PUBLIC_MONGODB_URI || '';

export const getListMessage = async ({
    sender_id,
    receiver_id
}: {
    sender_id: string;
    receiver_id: string;
}): Promise<
    { status: true; message: string; list: Array<Message> } | false
> => {
    try {
        await mongoose.connect(URI);
        const list: Array<Message> = await messages.find({
            $or: [
                { sender_id, receiver_id },
                { sender_id: receiver_id, receiver_id: sender_id }
            ]
        });
        if (list.length !== 0) {
            return {
                status: true,
                message:
                    'Succes get list message total message : ' + list.length,
                list
            };
        } else {
            return {
                status: true,
                message: 'no message found',
                list: []
            };
        }
    } catch (error) {
        console.error(error);
        return false;
    } finally {
        await mongoose.connection.close();
    }
};
