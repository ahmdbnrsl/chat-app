import { Poppins } from 'next/font/google';
import SessionWrap from './session';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    metadataBase: new URL(
        process.env.NEXT_PUBLIC_SELF_URL || 'http://localhost:3000'
    ),
    title: 'VB CHAT',
    description: 'Simple Chat App Web Basically',
    authors: [
        {
            name: 'Ahmad Beni Rusli',
            url: 'https://instagram.com/ahmd.bn.tsx'
        }
    ],
    icons: {
        icon: '/icon.png'
    },
    openGraph: {
        title: 'VB CHAT',
        description: 'Simple Chat App Web Basically',
        url: process.env.NEXT_PUBLIC_SELF_URL || 'https://vbchat.vercel.app/',
        siteName: 'Chat App',
        type: 'website',
        images: [
            {
                url: 'https://vbchat.vercel.app/og.png',
                secureUrl: 'https://vbchat.vercel.app/og.png',
                width: 1280,
                height: 700,
                alt: 'Open Graph VB CHAT Image'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'VB CHAT',
        description: 'Simple Chat App Web Basically ',
        images: {
            url: 'https://vbchat.vercel.app/og.png',
            alt: 'Twitter Card VB CHAT Image'
        }
    }
};

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
            <head>
                <meta
                    name='theme-color'
                    content='#09090b'
                />
            </head>
            <body
                translate='no'
                className={`${poppins.className} bg-zinc-950 select-none`}
            >
                <SessionWrap>{children}</SessionWrap>
            </body>
        </html>
    );
}
