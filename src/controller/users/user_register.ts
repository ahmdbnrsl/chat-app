import mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';
import { users } from '@/models/users';
import type { User } from '@/types';

const URI: string = process.env.NEXT_PUBLIC_MONGODB_URI || '';

export const storeUser = async ({
    wa_number,
    name,
    created_at
}: {
    wa_number: string;
    name: string;
    created_at: string;
}): Promise<{ result?: User; status: boolean; message: string } | false> => {
    try {
        await mongoose.connect(URI);
        wa_number = wa_number?.startsWith('0')
            ? wa_number?.replace(/\D/g, '').replace('0', '62')
            : wa_number?.replace(/\D/g, '');
        const checkExistingUser: User | null = await users.findOne({
            wa_number
        });

        if (!checkExistingUser) {
            const options: RequestInit = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    secret: process.env.NEXT_PUBLIC_SECRET,
                    num: wa_number
                }),
                cache: 'no-store'
            };
            const res: Response = await fetch(
                process.env.NEXT_PUBLIC_BASE_URL + '/check',
                options
            );
            if (res?.ok) {
                const checkExistingWANumber: { result: boolean } =
                    await res?.json();
                if (checkExistingWANumber?.result) {
                    const user_id: string = uuid();
                    const saveUser: User = await users.create({
                        user_id,
                        wa_number,
                        name,
                        created_at,
                        update_at: 'no_update',
                        role: 'member',
                        pp: 'empety'
                    });
                    return {
                        result: saveUser,
                        status: true,
                        message: 'Success Sign Up'
                    };
                } else {
                    return {
                        status: false,
                        message: `${wa_number} is not registered on WhatsApp`
                    };
                }
            } else {
                return false;
            }
        } else {
            return {
                status: false,
                message: 'Whatsapp number is already registered'
            };
        }
    } catch (error) {
        return false;
    } finally {
        await mongoose.connection.close();
    }
};
