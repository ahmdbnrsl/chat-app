import mongoose from 'mongoose';
import { NextResponse, NextRequest } from 'next/server';
import { users } from '@/models/users';
import type { U, User } from '@/types';

const URI: string = process.env.MONGODB_URI || '';

export async function POST(req: NextRequest) {
    const body: U['GetUserInfo'] = await req.json();
    const { secret, user_id, wa_number } = body;
    if (secret !== process.env.SECRET_TOKEN) {
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
