import { NextResponse, NextRequest } from 'next/server';
import FormData from 'form-data';

export async function POST(req: NextRequest) {
    try {
        const formData = new FormData();
        const imageFile = await req.formData();
        const file = imageFile.get('file') as Blob;
        const fileName = (file as File)?.name || 'upload.jpg';

        if (!file) {
            return NextResponse.json(
                { error: 'No file uploaded' },
                { status: 400 }
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        formData.append('file', buffer, { filename: fileName });

        const uploadResponse = await fetch('https://telegra.ph/upload', {
            method: 'POST',
            body: formData as unknown as BodyInit
        });

        const uploadResult = await uploadResponse.json();
        if (uploadResponse.ok && uploadResult[0]?.src) {
            return NextResponse.json({
                success: true,
                fileUrl: `https://telegra.ph${uploadResult[0]?.src}`
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
