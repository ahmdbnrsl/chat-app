'use client';
import { Poppins } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import MetadataWrap from './Metadata';
import './globals.css';

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <MetadataWrap>
                <head>
                    <meta
                        name='theme-color'
                        content='#09090b'
                    />
                </head>
                <body className={`${poppins.className} bg-zinc-950`}>
                    <SessionProvider>{children}</SessionProvider>
                </body>
            </MetadataWrap>
        </html>
    );
}
