import { NextResponse, NextRequest } from 'next/server';
import { getListMessage } from '@/controller/messages/get_list_message';
import type { M, Message } from '@/types';
import { groupMessagesByDateAndSender } from '@/services/groupingMessages';

export async function POST(req: NextRequest) {
    const body: M['GetListMessage'] = await req.json();
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
        const res: M['ListMessage'] | false = await getListMessage(body);
        if (res) {
            const sortedMessageByTimestamp: Array<Message> = (
                res?.result as Array<Message>
            )?.sort((a: Message, b: Message) => {
                return (
                    Number(a.message_timestamp) - Number(b.message_timestamp)
                );
            });
            return NextResponse.json({
                status: true,
                message: res?.message,
                result: groupMessagesByDateAndSender(sortedMessageByTimestamp)
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
