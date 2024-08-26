import { User } from '@/types';

export const getUserInfo = async ({
    user_id,
    wa_number
}: {
    user_id?: string;
    wa_number?: string;
}): Promise<{ status: boolean; message: string; result?: User } | false> => {
    try {
        const options: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + process.env.NEXT_PUBLIC_BEARER
            },
            body: JSON.stringify({
                user_id,
                wa_number,
                secret: process.env.NEXT_PUBLIC_SECRET
            }),
            cache: 'no-store'
        };
        const response: Response = await fetch(
            process.env.NEXT_PUBLIC_SELF_URL + '/api/get_user_info',
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
