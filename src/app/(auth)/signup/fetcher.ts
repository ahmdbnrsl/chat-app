'use server';
export const userSignUp = async ({
    wa_number,
    name,
    created_at
}: {
    wa_number: string;
    name: string;
    created_at: string;
}): Promise<{ status: boolean; message: string } | false> => {
    try {
        const options: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                wa_number,
                name,
                created_at,
                secret: process.env.NEXT_PUBLIC_SECRET
            }),
            cache: 'no-store'
        };
        const response: Response = await fetch(
            'https://chat-app-rouge-alpha.vercel.app/api/register',
            otpions
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
