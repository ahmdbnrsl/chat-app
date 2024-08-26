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
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + process.env.NEXT_PUBLIC_BEARER
            },
            body: JSON.stringify({
                sender_id,
                receiver_id,
                secret: process.env.NEXT_PUBLIC_SECRET
            }),
            cache: 'no-store'
        };
        const response: Response = await fetch(
            process.env.NEXT_PUBLIC_SELF_URL + '/api/get_messages',
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

export const sendMessage = async ({
    sender_id,
    receiver_id,
    message_text,
    message_timestamp
}: {
    sender_id: string | undefined;
    receiver_id: string | undefined;
    message_text: string;
    message_timestamp: string;
}): Promise<{ status: boolean; message: string } | false> => {
    try {
        const options: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + process.env.NEXT_PUBLIC_BEARER
            },
            body: JSON.stringify({
                sender_id,
                receiver_id,
                message_text,
                message_timestamp,
                secret: process.env.NEXT_PUBLIC_SECRET
            }),
            cache: 'no-store'
        };
        const response: Response = await fetch(
            process.env.NEXT_PUBLIC_SELF_URL + '/api/push_message',
            options
        );
        const res: {
            status: boolean;
            message: string;
        } = await response.json();
        if (response?.ok) {
            return {
                status: true,
                message: res?.message
            };
        } else if (response?.status === 404) {
            return {
                status: false,
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

export const deleteMessage = async (
    message_id: string
): Promise<{ status: boolean; message: string } | false> => {
    try {
        const options: RequestInit = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + process.env.NEXT_PUBLIC_BEARER
            },
            body: JSON.stringify({
                message_id,
                secret: process.env.NEXT_PUBLIC_SECRET
            }),
            cache: 'no-store'
        };
        const response: Response = await fetch(
            process.env.NEXT_PUBLIC_SELF_URL + '/api/delete_message',
            options
        );
        const res: {
            status: boolean;
            message: string;
        } = await response.json();
        if (response?.ok) {
            return {
                status: true,
                message: res?.message
            };
        } else if (response?.status === 400) {
            return {
                status: false,
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
