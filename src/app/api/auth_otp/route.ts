import { NextResponse, NextRequest } from 'next/server';
import { User } from '@/models/users';
import { authOTP } from '@/services/otps/otp_auth';

interface BodyRequest {
    name: string;
    wa_number: string;
    otp_code: string;
    timestamp: string;
    secret: string;
}

interface Result {
    result?: User;
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
        const res: Result | false = await authOTP(body);
        if (res) {
            if (res?.status) {
                return NextResponse.json(
                    {
                        status: true,
                        message: res?.message
                    },
                    { status: 200 }
                );
            } else {
                return NextResponse.json(
                    {
                        status: false,
                        message: res?.message
                    },
                    { status: 500 }
                );
            }
        } else {
            return NextResponse.json(
                {
                    status: false,
                    message: 'Server error'
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
                message: 'Server error'
            },
            {
                status: 500
            }
        );
    }
}
