'use server';
import type { O } from '@/types';

export const sendOTPCode = async (
    bodyOptions: O['SendOTPCode']
): Promise<O['IsOTPCode'] | false> => {
    try {
        bodyOptions.secret = process.env.NEXT_PUBLIC_SECRET;
        const options: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + process.env.NEXT_PUBLIC_BEARER
            },
            body: JSON.stringify(bodyOptions),
            cache: 'no-store'
        };
        const response: Response = await fetch(
            process.env.NEXT_PUBLIC_SELF_URL + '/api/send_otp',
            options
        );
        const res: O['IsOTPCode'] = await response.json();
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
        return false;
    }
};
