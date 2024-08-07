import { NextResponse, NextRequest } from 'next/server';
import { OTP } from '@/models/otps';
import { storeOTP } from '@/services/otps/otp_store';
interface BodyRequest {
    wa_number: string;
    created_at: string;
    expired_at: string;
    secret: string;
}

function generateOTP(): string {
    let digits: string = '0123456789';
    let otp: string = '';
    let len: number = digits.length;
    for (let i = 0; i < 6; i++) {
        otp += digits[Math.floor(Math.random() * len)];
    }
    return otp;
}

export async function POST(req: NextRequest) {
    const body: BodyRequest = await req.json();
    const { wa_number, created_at, expired_at, secret } = body;
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
        const otp_code: string = generateOTP();
        const res: { result: OTP; status: boolean } | boolean = await storeOTP({
            wa_number,
            otp_code,
            created_at,
            expired_at,
            secret
        });
        if (!res) {
            return NextResponse.json(
                {
                    status: false,
                    message: 'something went wrong!'
                },
                { status: 500 }
            );
        } else {
            const mess: string = `Your OTP code is : *${otp_code}*\ndon't share this to other people.`;
            const buttons: Array<object> = [
                {
                    name: 'cta_copy',
                    buttonParamsJson: JSON.stringify({
                        display_text: 'Copy Your OTP',
                        copy_code: otp_code
                    })
                }
            ];
            const option: RequestInit = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    secret: process.env.NEXT_PUBLIC_SECRET,
                    number: wa_number,
                    mess,
                    rep: 'benChat verify',
                    quoted: '',
                    buttons: JSON.stringify(buttons)
                })
            };
            const response: boolean = await fetch(
                process.env.NEXT_PUBLIC_BASE_URL + '/custom',
                option
            ).then((res: any): boolean => (res.status == 200 ? true : false));
            if (response) {
                return NextResponse.json(
                    {
                        status: true,
                        message: 'success send OTP'
                    },
                    { status: 200 }
                );
            } else {
                return NextResponse.json(
                    {
                        status: false,
                        message: 'OTP failed to send'
                    },
                    { status: 500 }
                );
            }
        }
    } catch (error) {
        return NextResponse.json(
            {
                status: false,
                message: 'Server Error!'
            },
            { status: 500 }
        );
    }
}
