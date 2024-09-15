import mongoose from 'mongoose';
import { NextResponse, NextRequest } from 'next/server';
import { users } from '@/models/users';
import type { U, User } from '@/types';

const URI: string = process.env.MONGODB_URI || '';

export async function POST(req: NextRequest) {
    const body: U['GetUserInfo'] = await req.json();
    const { secret } = body;
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
        await mongoose.connect(URI);
        let result: User[] = await users.find();

        return NextResponse.json({
            status: true,
            message: 'Success find all user',
            result
        });
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
