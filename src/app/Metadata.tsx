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
    },
    themeColor: '#09090b'
};

export default async function MetadataWrap({
    children
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
