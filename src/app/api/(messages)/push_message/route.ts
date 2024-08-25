import { NextResponse, NextRequest } from 'next/server';
import { Message } from '@/models/messages';
import { pushMessage } from '@/controller/messages/push_message';

interface BodyRequest {
    sender_id: string;
    receiver_id: string;
    message_text: string;
    message_timestamp: string;
    secret: string;
}

interface Result {
    result?: Message;
    status: boolean;
    message: string;
}

export async function POST(req: NextRequest) {
    const body: BodyRequest = await req.json();
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
        const result: Result | false = await pushMessage(body);
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
