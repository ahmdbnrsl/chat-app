import { NextResponse, NextRequest } from 'next/server';
import type { User, U } from '@/types';
import { storeUser } from '@/controller/users/user_register';

export async function POST(req: NextRequest) {
    const body: U['Signup'] = await req.json();
    const { secret } = body;
    if (secret !== process.env.NEXT_PUBLIC_SECRET) {
        return NextResponse.json(
            {
                status: false,
                message: 'token is invalid'
            },
            { status: 400 }
        );
    }
    try {
        const result:
            | { result?: User; status: boolean; message: string }
            | false = await storeUser(body);
        if (result) {
            if (result?.status) {
                return NextResponse.json(
                    {
                        status: true,
                        message: result?.message
                    },
                    { status: 200 }
                );
            } else {
                return NextResponse.json(
                    {
                        status: false,
                        message: result?.message
                    },
                    { status: 400 }
                );
            }
        }
    } catch (error) {
        return NextResponse.json(
            {
                status: false,
                message: 'Server Error!'
            },
            { status: 500 }
        );
    }
}
