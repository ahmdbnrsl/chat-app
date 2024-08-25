'use server';

interface KeyParams {
    wa_number: string;
    created_at: string;
    expired_at: string;
}

export const sendOTPCode = async ({
    wa_number,
    created_at,
    expired_at
}: KeyParams): Promise<{ status: boolean; message: string } | false> => {
    try {
        const options: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + process.env.NEXT_PUBLIC_BEARER
            },
            body: JSON.stringify({
                wa_number,
                created_at,
                expired_at,
                secret: process.env.NEXT_PUBLIC_SECRET
            }),
            cache: 'no-store'
        };
        const response: Response = await fetch(
            process.env.NEXT_PUBLIC_SELF_URL + '/api/send_otp',
            options
        );
        const res: { status: boolean; message: string } = await response.json();
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
