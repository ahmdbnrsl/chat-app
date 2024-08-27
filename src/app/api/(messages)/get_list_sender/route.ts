import { NextResponse, NextRequest } from 'next/server';
import { getListSender } from '@/controller/messages/get_list_sender';
import type { M, SenderMessage } from '@/types';

export async function POST(req: NextRequest) {
    const body: M['GetListSender'] = await req.json();
    const { user_id, secret } = body;

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
        const res: M['ListSender'] | false = await getListSender(user_id);
        if (res) {
            if (res?.status) {
                const sortedMessageByTimestamp: M['ListSender']['result'] =
                    res?.result?.sort((a: SenderMessage, b: SenderMessage) => {
                        return (
                            Number(a.latestMessageTimestamp) -
                            Number(b.latestMessageTimestamp)
                        );
                    });
                return NextResponse.json({
                    result: sortedMessageByTimestamp,
                    status: true,
                    message: res?.message
                });
            } else {
                return NextResponse.json(
                    {
                        status: false,
                        message: res?.message
                    },
                    { status: 400 }
                );
            }
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
        return NextResponse.json(
            {
                status: false,
                message: 'Something went wrong'
            },
            { status: 500 }
        );
    }
}
