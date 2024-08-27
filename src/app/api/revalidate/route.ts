import { NextResponse, NextRequest } from 'next/server';
import { revalidateTag } from 'next/cache';
import type { RevalidateBodyRequest } from '@/types';

export async function POST(request: NextRequest) {
    const body: RevalidateBodyRequest = await req.json();
    const { secret, tag } = body;
    if (secret !== process.env.NEXT_PUBLIC_SECRET) {
        return NextResponse.json(
            {
                status: false,
                message: 'token is invalid'
            },
            { status: 400 }
        );
    }
    if (!tag) {
        return NextResponse.json(
            { status: 400, message: 'missing' },
            { status: 400 }
        );
    }
    revalidateTag(tag);
    return NextResponse.json(
        {
            status: 200,
            message: 'success revalidate!'
        },
        { status: 200 }
    );
}
