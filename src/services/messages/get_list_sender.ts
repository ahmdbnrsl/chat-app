import mongoose from 'mongoose';
import { Message, messages } from '@/models/messages';
import { users, User } from '@/models/users';

const URI: string = process.env.NEXT_PUBLIC_MONGODB_URI || '';

interface Result {
    pp: string | undefined;
    name: string | undefined;
    wa_number: string | undefined;
    latestMessageText: string | undefined;
    latestMessageTimestamp: string | undefined;
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
        if (listData.length === 0) {
            return [];
        }
        const userData: Array<{ user_id: string }> = listData.map(
            (user_id: string) => {
                return {
                    user_id
                };
            }
        );
        const userss: Array<User> = await users.find({ $or: userData });
        const listSender: Result = userss.map(async (user: User) => {
            const message: Array<Message> = await messages.find({
                $or: [
                    { sender_id: user_id, receiver_id: user?.user_id },
                    { sender_id: user?.user_id, receiver_id: user_id }
                ]
            });
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