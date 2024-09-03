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

    if (res && res?.status) {
        let user: User | undefined = res?.result as User;
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
                images: [
                    user?.pp
                        ? user?.pp !== 'empety'
                            ? user?.pp
                            : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                        : ''
                ]
            },
            twitter: {
                card: 'summary_large_image',
                title: 'VB CHAT | Chat',
                description: 'Chat with ' + user?.name,
                images: {
                    url: user?.pp
                        ? user?.pp !== 'empety'
                            ? user?.pp
                            : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                        : '',
                    alt: 'Twitter Card VB CHAT Image'
                }
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
