import type { Metadata } from 'next';

const base: string =
    process.env.NEXT_PUBLIC_SELF_URL || 'https://vbchat.vercel.app';

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: `VB CHAT | Sign Up`,
        openGraph: {
            title: 'VB CHAT | Sign Up',
            description: 'Create an VB CHAT account',
            url: base,

            siteName: 'Chat App',
            type: 'website',
            images: [base + '/authOG/signup.png']
        },
        twitter: {
            card: 'summary_large_image',
            title: 'VB CHAT | Sign Up',
            description: 'Create an VB CHAT account',
            images: {
                url: base + '/authOG/signup.png',
                alt: 'Twitter Card VB CHAT Image'
            }
        }
    };
}

export default function SignupLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
