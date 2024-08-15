import { NextResponse, NextRequest } from 'next/server';
import { getListMessage } from '@/services/messages/get_list_message';
import { Message } from '@/models/messages';

interface BodyRequest {
    sender_id: string;
    receiver_id: string;
    secret: string;
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
        const result:
            | { status: true; message: string; list: Array<Message> }
            | false = await getListMessage(body);
        if (result) {
            const sortedMessageByTimestamp: Array<Message> = result?.list.sort(
                (a: Message, b: Message) => {
                    return (
                        Number(a.message_timestamp) -
                        Number(b.message_timestamp)
                    );
                }
            );
            return NextResponse.json({
                status: true,
                message: result?.message,
                result: sortedMessageByTimestamp
            });
        } else {
            return NextResponse.json(
                {
                    status: false,
                    message: 'Server error!'
                },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                status: false,
                message: 'Something went wrong!'
            },
            { status: 500 }
        );
    }
}
