'use server';
import { Message } from '@/models/messages';
import { User } from '@/models/users';

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

export const getSenderInfo = async (
    user_id: string
): Promise<{ status: boolean; message: string; result?: User } | false> => {
    try {
        const options: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id,

                secret: process.env.NEXT_PUBLIC_SECRET
            }),
            cache: 'no-store'
        };
        const response: Response = await fetch(
            'https://chat-app-rouge-alpha.vercel.app/api/get_user_info',
            options
        );
        const res: {
            result?: User;
            status: boolean;
            message: string;
        } = await response.json();
        if (response?.ok) {
            return {
                status: true,
                message: res?.message,
                result: res?.result
            };
        } else if (response?.status === 404) {
            return {
                status: true,
                message: res?.message
            };
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
};
