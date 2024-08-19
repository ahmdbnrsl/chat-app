import { NextResponse, NextRequest } from 'next/server';
import { Result, getListSender } from '@/services/messages/get_list_sender';

interface BodyRequest {
    user_id: string;
    secret: string;
}

export async function POST(req: NextRequest) {
    const body: BodyRequest = await req.json();
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
        const res:
            | { result?: Array<Result>; status: boolean; message: string }
            | false = await getListSender(user_id);
        if (res) {
            if (res?.status) {
                return NextResponse.json({
                    result: res?.result,
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
