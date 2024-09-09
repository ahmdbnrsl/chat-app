import { NextResponse, NextRequest } from 'next/server';
import type { M, Message } from '@/types';
import { pushMessage } from '@/controller/messages/push_message';

export async function POST(req: NextRequest) {
    const body: M['SendMessage'] = await req.json();
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
        const result: M['IsMessage'] | false = await pushMessage(body);
        if (result) {
            if (result?.status) {
                return NextResponse.json({
                    status: true,
                    message: result?.message
                });
            } else {
                return NextResponse.json(
                    {
                        status: false,
                        message: result?.message
                    },
                    { status: 404 }
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
        return NextResponse.json(
            {
                status: false,
                message: 'Something went wrong'
            },
            { status: 500 }
        );
    }
}
