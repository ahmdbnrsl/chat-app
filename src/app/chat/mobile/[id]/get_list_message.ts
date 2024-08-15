'use server';
import { Message } from '@/models/messages';

export const getListMessage = async (
    sender_id: string,
    receiver_id: string
): Promise<
    { status: boolean; message: string; result?: Array<Message> } | false
> => {
    try {
        const options: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sender_id,
                receiver_id,
                secret: process.env.NEXT_PUBLIC_SECRET
            }),
            next: {
                revalidate: 2
            }
        };
        const response: Response = await fetch(
            'https://chat-app-rouge-alpha.vercel.app/api/get_messages',
            options
        );
        const res: {
            result?: Array<Message>;
            status: boolean;
            message: string;
        } = await response.json();
        if (response?.ok) {
            return {
                status: true,
                message: res?.message,
                result: res?.result
            };
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
};
