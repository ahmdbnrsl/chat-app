import { NextResponse, NextRequest } from 'next/server';
import { readMessage } from '@/controller/messages/read_message';
import type { M } from '@/types';

export async function PATCH(req: NextRequest) {
    const body: M['ReadMessage'] = await req.json();
    const { secret, sender_id, receiver_id } = body;
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
        const result: { status: boolean; message: string } | false =
            await readMessage({ sender_id, receiver_id });
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
                    {
                        status: 500
                    }
                );
            }
        } else {
            return NextResponse.json(
                {
                    status: false,
                    message: 'server error'
                },
                {
                    status: 500
                }
            );
        }
    } catch (error) {
        return NextResponse.json(
            {
                status: false,
                message: 'something went wrong!'
            },
            {
                status: 500
            }
        );
    }
}
