import mongoose from 'mongoose';
import { Message, messages } from '@/models/messages';
import { DeleteResult } from 'mongodb';

const URI: string = process.env.NEXT_PUBLIC_MONGODB_URI || '';

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
