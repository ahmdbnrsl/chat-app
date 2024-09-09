'use server';

export const revalidate = async (tag: string): Promise<boolean> => {
    try {
        let options: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + process.env.BEARER_TOKEN
            },
            body: JSON.stringify({
                tag,
                secret: process.env.SECRET_TOKEN
            })
        };
        const response: Response = await fetch(
            process.env.NEXT_PUBLIC_SELF_URL + '/api/revalidate',
            options
        );
        if (response?.ok) {
            return true;
        }
        return false;
    } catch (error) {
        console.error(error);
        return false;
    }
};
