import type { Metadata } from 'next';

const base: string =
    process.env.NEXT_PUBLIC_SELF_URL || 'https://vbchat.vercel.app';

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: `VB CHAT | Edit Profile`,
        openGraph: {
            title: 'VB CHAT | Edit Profile',
            description: 'Edit Profile',
            url: base,

            siteName: 'Chat App',
            type: 'website'
        },
        twitter: {
            card: 'summary_large_image',
            title: 'VB CHAT | Edit Profile',
            description: 'Edit Profile'
        }
    };
}

export default function EditProfileLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
