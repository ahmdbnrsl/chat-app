import mongoose from 'mongoose';
import { messages } from '@/models/messages';
import type { DeleteResult } from 'mongodb';
import type { Message } from '@/types';

const URI: string = process.env.MONGODB_URI || '';

export const deleteMessage = async (
    message_id: string
): Promise<{ status: boolean; message: string } | false> => {
    try {
        await mongoose.connect(URI);
        const checkExistingMessage: Message | null = await messages.findOne({
            message_id
        });
        if (!checkExistingMessage)
            return {
                status: false,
                message: 'message not found'
            };
        const deleted: DeleteResult = await messages.deleteOne({ message_id });
        if (deleted.acknowledged) {
            return {
                status: true,
                message: 'success deleting message'
            };
        } else {
            return {
                status: false,
                message: 'failed to delete message'
            };
        }
    } catch (error) {
        console.error(error);
        return false;
    } finally {
        await mongoose.connection.close();
    }
};
