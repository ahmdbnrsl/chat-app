import type { Metadata } from 'next';

const base: string =
    process.env.NEXT_PUBLIC_SELF_URL || 'https://vbchat.vercel.app';

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: `VB CHAT | Login`,
        openGraph: {
            title: 'VB CHAT | Login',
            description: 'Login to your VB CHAT account',
            url: base,

            siteName: 'Chat App',
            type: 'website',
            images: [base + '/authOG/login.png']
        },
        twitter: {
            card: 'summary_large_image',
            title: 'VB CHAT | Login',
            description: 'Login to your VB CHAT account',
            images: {
                url: base + '/authOG/login.png',
                alt: 'Twitter Card VB CHAT Image'
            }
        }
    };
}

export default function LoginLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
