'use server';
export const editUser = async ({
    user_id,
    new_name,
    new_pp,
    update_at
}: {
    user_id: string;
    new_name?: string;
    new_pp?: string;
    update_at: string;
}): Promise<{ status: boolean; message: string } | false> => {
    try {
        const options: RequestInit = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id,
                new_name,
                new_pp,
                update_at,
                secret: process.env.NEXT_PUBLIC_SECRET
            }),
            cache: 'no-store'
        };
        const response: Response = await fetch(
            process.env.NEXT_PUBLIC_SELF_URL + '/api/update_profile',
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
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
};
