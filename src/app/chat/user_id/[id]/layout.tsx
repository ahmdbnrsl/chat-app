import type { Metadata } from 'next';
import { FetcherService as getUserInfo } from '@/services/fetcherService';
import type { User } from '@/types';

export async function generateMetadata({
    params
}: {
    params: { id: string };
}): Promise<Metadata> {
    const res = await getUserInfo(
        { user_id: params.id },
        { path: 'get_user_info', method: 'POST' }
    );
    let user: User | undefined = res?.result as User;
    if (res && res?.status) {
        return {
            title: `VB CHAT ${user?.name && '| ' + user?.name}`,
            openGraph: {
                title: 'VB CHAT | Chat',
                description: 'Chat with ' + user?.name,
                url:
                    process.env.NEXT_PUBLIC_SELF_URL ||
                    'https://vbchat.vercel.app/',
                siteName: 'Chat App',
                type: 'website',
                images: [user?.pp || '']
            }
        };
    } else {
        return {
            title: 'VB CHAT | Chat'
        };
    }
}

export default function ChatRoomLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
