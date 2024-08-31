import { NextResponse, NextRequest } from 'next/server';
import { getListMessage } from '@/controller/messages/get_list_message';
import type { M, Message } from '@/types';

interface GroupedMessage {
    message_text: string;
    message_id: string;
    message_timestamp: string;
    _id: string;
}

interface SenderGroup {
    sender_id: string;
    messages: GroupedMessage[];
}

interface DateGroup {
    date: string;
    messages: SenderGroup[];
}

function groupMessagesByDateAndSender(messages: Message[]): DateGroup[] {
    const groupedByDate = messages.reduce(
        (
            acc: Record<string, Record<string, GroupedMessage[]>>,
            curr: Message
        ) => {
            const date = new Date(
                parseInt(curr.message_timestamp)
            ).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });

            if (!acc[date]) {
                acc[date] = {};
            }

            if (!acc[date][curr.sender_id]) {
                acc[date][curr.sender_id] = [];
            }

            acc[date][curr.sender_id].push({
                message_text: curr.message_text.trim(),
                message_id: curr.message_id,
                message_timestamp: curr.message_timestamp,
                _id: curr._id
            });

            return acc;
        },
        {} as Record<string, Record<string, GroupedMessage[]>>
    );

    const result: DateGroup[] = Object.keys(groupedByDate).map(date => ({
        date,
        messages: Object.keys(groupedByDate[date]).map(sender_id => ({
            sender_id,
            messages: groupedByDate[date][sender_id]
        }))
    }));

    return result;
}

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
