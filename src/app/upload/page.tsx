'use client';

import { useState, ChangeEvent, FormEvent } from 'react';

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<string | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        setFile(selectedFile);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!file) {
            setUploadStatus('Please select a file first');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                setUploadStatus(
                    `File uploaded successfully! File URL: ${result.fileUrl}`
                );
            } else {
                setUploadStatus(`Upload failed: ${result.error}`);
            }
        } catch (error) {
            setUploadStatus(`Error: ${(error as Error).message}`);
        }
    };

    return (
        <div>
            <h1>Upload a File</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type='file'
                    onChange={handleFileChange}
                />
                <button type='submit'>Upload</button>
            </form>
            {uploadStatus && <p>{uploadStatus}</p>}
        </div>
    );
}
