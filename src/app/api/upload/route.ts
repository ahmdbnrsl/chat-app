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

        if (uploadResponse.ok && uploadResult[0].src) {
            return NextResponse.json({
                success: true,
                fileUrl: `https://telegra.ph${uploadResult[0].src}`
            });
        } else {
            console.error(uploadResult);
            return NextResponse.json(
                { error: 'Failed to upload image' },
                { status: uploadResponse?.status }
            );
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}
