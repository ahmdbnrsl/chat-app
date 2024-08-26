import { NextResponse, NextRequest } from 'next/server';
import { deleteMessage } from '@/controller/messages/delete_message';

interface BodyRequest {
    secret: string;
    message_id: string;
}

export async function DELETE(req: NextRequest) {
    const body: BodyRequest = await req.json();
    const { secret, message_id } = body;
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
        const deleted: { status: boolean; message: string } | false =
            await deleteMessage(message_id);
        if (deleted)
            if (deleted?.status) {
                return NextResponse.json({
                    status: true,
                    message: deleted?.message
                });
            } else
                return NextResponse.json(
                    {
                        status: false,
                        message: deleted?.message
                    },
                    { status: 400 }
                );
        if (!deleted)
            return NextResponse.json(
                {
                    status: false,
                    message: 'Server error'
                },
                { status: 500 }
            );
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
