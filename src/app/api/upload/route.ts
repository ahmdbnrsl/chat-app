import { NextResponse, NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        const body = new FormData();
        body.append('file', file, file.name);

        const uploadResponse = await fetch('https://telegra.ph/upload', {
            method: 'POST',
            body: body
        });

        const uploadResult: { src: string }[] = await uploadResponse.json();

        if (uploadResponse.ok) {
            return NextResponse.json({
                success: true,
                fileUrl: `https://telegra.ph${uploadResult[0].src}`
            });
        } else {
            return NextResponse.json(
                { error: 'Failed to upload the file' },
                { status: 500 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}
