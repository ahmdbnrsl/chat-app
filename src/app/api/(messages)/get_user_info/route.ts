import mongoose from 'mongoose';
import { NextResponse, NextRequest } from 'next/server';
import { users, User } from '@/models/users';

interface BodyRequest {
    user_id?: string;
    wa_number?: string;
    secret: string;
}

const URI: string = process.env.NEXT_PUBLIC_MONGODB_URI || '';

export async function POST(req: NextRequest) {
    const body: BodyRequest = await req.json();
    const { secret, user_id, wa_number } = body;
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
        type WANumber = string;
        await mongoose.connect(URI);
        let result: User | null = user_id
            ? await users.findOne({ user_id })
            : await users.findOne({ wa_number: wa_number as WANumber });
        if (result) {
            return NextResponse.json({
                status: true,
                message: 'Success find user',
                result
            });
        } else {
            return NextResponse.json(
                {
                    status: false,
                    message: 'Cannot find user'
                },
                { status: 404 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            {
                status: false,
                message: 'Server error'
            },
            { status: 500 }
        );
    } finally {
        await mongoose.connection.close();
    }
}
