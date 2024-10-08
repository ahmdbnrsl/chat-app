import { NextResponse, NextRequest } from 'next/server';
import { editUser } from '@/controller/users/users_update';
import type { U } from '@/types';

export async function PUT(req: NextRequest) {
    const body: U['EditUser'] = await req.json();
    const { secret } = body;
    if (secret !== process.env.SECRET_TOKEN) {
        return NextResponse.json(
            {
                status: false,
                message: 'token is invalid'
            },
            { status: 400 }
        );
    }
    try {
        const updateUser: { status: boolean; message: string } | false =
            await editUser(body);
        if (updateUser) {
            if (updateUser?.status) {
                return NextResponse.json({
                    status: true,
                    message: updateUser?.message
                });
            } else {
                return NextResponse.json(
                    {
                        status: false,
                        message: updateUser?.message
                    },
                    { status: 400 }
                );
            }
        } else {
            return NextResponse.json(
                {
                    status: false,
                    message: 'Server error'
                },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                status: false,
                message: 'Something went wrong'
            },
            { status: 500 }
        );
    }
}
