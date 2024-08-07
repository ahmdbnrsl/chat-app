import { NextResponse, NextRequest } from 'next/server';
import { User } from '@/models/users';
import { authOTP } from '@/services/otp_auth';

interface BodyRequest {
    name: string;
    wa_number: string;
    otp_code: string;
    timestamp: string;
    secret: string;
}

export async function POST(req: NextRequest) {
    const body: BodyRequest = await req.json();
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
            | { result?: User; status: boolean; message: string }
            | boolean = await authOTP(body);
        if (!result) {
            return NextResponse.json(
                {
                    status: false,
                    message: 'Server error'
                },
                {
                    status: 500
                }
            );
        } else {
            if (result?.status) {
                return NextResponse.json(
                    {
                        status: true,
                        message: result?.message
                    },
                    { status: 200 }
                );
            } else {
                return NextResponse.json(
                    {
                        status: false,
                        message: result?.message
                    },
                    { status: 500 }
                );
            }
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
