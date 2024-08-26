'use server';
import type { U } from '@/types';

export const userFetcher = async (
    bodyOptions: U['GetUserInfo'] | U['Signup'] | U['EditUser'],
    fetchOptions: U['FetchOptions']
): Promise<U['UserInfo'] | false> => {
    try {
        bodyOptions.secret = process.env.NEXT_PUBLIC_SECRET;
        const options: RequestInit = {
            method: fetchOptions.method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + process.env.NEXT_PUBLIC_BEARER
            },
            body: JSON.stringify(bodyOptions),
            cache: 'no-store'
        };
        const response: Response = await fetch(
            process.env.NEXT_PUBLIC_SELF_URL + '/api/' + fetchOptions.path,
            options
        );
        const res: U['UserInfo'] = await response.json();
        if (response?.ok && res?.status) {
            if (res?.result) {
                return {
                    status: true,
                    message: res?.message,
                    result: res?.result
                };
            } else {
                return {
                    status: true,
                    message: res?.message
                };
            }
        } else if (response?.status === 404 || response?.status === 400) {
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
