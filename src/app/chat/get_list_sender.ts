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
    { result?: Array<Result>; status: boolean; message: string } | false
> => {
    try {
        const options: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + process.env.NEXT_PUBLIC_BEARER
            },
            body: JSON.stringify({
                user_id,
                secret: process.env.NEXT_PUBLIC_SECRET
            }),
            cache: 'no-store'
        };
        const response: Response = await fetch(
            process.env.NEXT_PUBLIC_SELF_URL + '/api/get_list_sender',
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
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
};
