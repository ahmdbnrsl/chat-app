'use server';

interface Result {
    pp: string;
    name: string;
    wa_number: string;
    fromMe: boolean;
    latestMessageText: string;
    latestMessageTimestamp: string;
    id_user: string;
}
export const getListSender = async (
    user_id: string
): Promise<
    { status: boolean; message: string; result?: Array<Result> } | false
> => {
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
            next: {
                revalidate: 10
            }
        };
        const response: Response = await fetch(
            'https://chat-app-rouge-alpha.vercel.app/api/get_list_sender',
            options
        );
        const res: {
            result?: Array<Result>;
            status: boolean;
            message: string;
        } = await response.json();
        if (response?.ok) {
            return {
                status: true,
                message: res?.message,
                result: res?.result
            };
        } else if (response?.status === 400) {
            console.error(res?.message);
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
