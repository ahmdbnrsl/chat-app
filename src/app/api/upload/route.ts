import { NextResponse, NextRequest } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
    try {
        const imageFile = await req.formData();
        const file = imageFile.get('file') as File;
        if (!file) {
            return NextResponse.json(
                { error: 'No file uploaded' },
                { status: 400 }
            );
        }

        const base64File = await file.arrayBuffer();
        const fileBuffer = Buffer.from(base64File).toString('base64');
        const uploadResponse = await cloudinary.uploader.upload(
            `data:${file.type};base64,${fileBuffer}`,
            {
                folder: 'uploads',
                public_id: uuidv4()
            }
        );

        return NextResponse.json({
            success: true,
            fileUrl: uploadResponse.secure_url
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}
