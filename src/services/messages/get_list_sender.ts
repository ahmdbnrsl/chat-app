import mongoose from 'mongoose';
import { Message, messages } from '@/models/messages';
import { users, User } from '@/models/users';

const URI: string = process.env.NEXT_PUBLIC_MONGODB_URI || '';

interface Result {
    pp: string;
    name: string;
    wa_number: string;
    latestMessageText: string;
    latestMessageTimestamp: string;
}

export const getListSender = async ({
    user_id
}: {
    user_id: string;
}): Promise<Array<Result> | false> => {
    try {
        const list: Array<Message> = await messages.find({
            $or: [{ sender_id: user_id }, { receiver_id: user_id }]
        });
        let uniqueSenders: Set<string> = new Set();
        let uniqueReceivers: Set<string> = new Set();
        let senderArray: string[] = [];
        let receiverArray: string[] = [];

        list.forEach((item: Message) => {
            if (!uniqueSenders.has(item.sender_id)) {
                uniqueSenders.add(item.sender_id);
                senderArray.push(item.sender_id);
            }
            if (!uniqueReceivers.has(item.receiver_id)) {
                uniqueReceivers.add(item.receiver_id);
                receiverArray.push(item.receiver_id);
            }
        });

        const listData: string[] = [...senderArray, ...receiverArray];
        let index: number = listData.indexOf(user_id);
        if (index !== -1) {
            listData.splice(index, 1);
        }
        const listSender = listData.map(async (item: string) => {
            const message: Array<Message> = await messages.find({
                $or: [
                    { sender_id: user_id, receiver_id: item },
                    { sender_id: item, receiver_id: user_id }
                ]
            });
            const user: User | null = await users.findOne({ user_id: item });
            const latestMessage: Message = message.reduce(
                (prev: Message, current: Message) =>
                    Number(prev.message_timestamp) >
                    Number(current.message_timestamp)
                        ? prev
                        : current
            );
            return {
                pp: user?.pp,
                name: user?.name,
                wa_number: user?.wa_number,
                latestMessageText: latestMessage?.message_text,
                latestMessageTimestamp: latestMessage?.message_timestamp
            };
        });
        return Promise.all(listSender);
    } catch (error) {
        return false;
    }
};
