import type { Metadata } from 'next';

const base: string =
    process.env.NEXT_PUBLIC_SELF_URL || 'https://vbchat.vercel.app';

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: `VB CHAT | Profile`,
        openGraph: {
            title: 'VB CHAT | Profile',
            description: 'Profile',
            url: base,

            siteName: 'Chat App',
            type: 'website'
        },
        twitter: {
            card: 'summary_large_image',
            title: 'VB CHAT | Profile',
            description: 'Profile'
        }
    };
}

export default function EditLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className='transition-all w-full min-h-screen bg-zinc-900 sm:bg-zinc-950 sm:bg-ornament sm:bg-[length:500px]'>
            <section className='w-full min-h-screen sm:p-5 flex flex-col sm:justify-center sm:items-center'>
                {children}
            </section>
        </main>
    );
}
