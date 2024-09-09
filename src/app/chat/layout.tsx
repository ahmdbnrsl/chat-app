'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';
import { FetcherService } from '@/services/fetcherService';
import type { SenderMessage } from '@/types';
import { io } from 'socket.io-client';
import { Message } from '@/types';
import { usePathname } from 'next/navigation';
import SidebarChat from './Sidebar';
import Wrapper from './Wrapper';
const socketURL = process.env.NEXT_PUBLIC_SOCKET_URL || '';
const socket = io(socketURL);

export default function Layout({ children }: { children: React.ReactNode }) {
    const { data: session, status }: { data: any; status: string } =
        useSession();
    const [width, setWidth] = useState<number>(0);
    const [listSender, setListSender] = useState<
        Array<SenderMessage> | undefined | null
    >(null);

    const fetchListSender = useCallback(async (): Promise<void> => {
        if (!session?.user?.user_id) return;
        const res = await FetcherService(
            { user_id: session?.user.user_id },
            {
                path: 'get_list_sender',
                method: 'POST'
            }
        );
        if (res && res?.status)
            setListSender((res?.result as Array<SenderMessage>)?.reverse());
    }, [session?.user.user_id]);

    useEffect(() => {
        if (!session?.user?.user_id) return;

        fetchListSender();
        const handleDataUpdated = (newData: Message) => {
            if (!newData) return;
            if (
                newData.sender_id === session?.user.user_id ||
                newData.receiver_id === session?.user?.user_id
            ) {
                fetchListSender();
            }
        };

        socket.on('connect', () => console.info('live chat opened'));
        socket.on('data_updated', handleDataUpdated);
        socket.on('data_deleted', () => fetchListSender());
        socket.on('disconnect', () => console.info('live chat closed'));

        return () => {
            socket.off('data_updated', handleDataUpdated);
            socket.off('data_deleted');
        };
    }, [fetchListSender, session?.user?.user_id]);

    useEffect(() => {
        setWidth(window.innerWidth);
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const pathName = usePathname();

    if (pathName.startsWith('/chat/profile')) {
        return <>{children}</>;
    }

    if (width < 1280) {
        if (pathName.startsWith('/chat/user_id')) {
            return <>{children}</>;
        }
        return (
            <main className='bg-zinc-950 w-full h-screen flex'>
                <Wrapper>
                    <SidebarChat listSender={listSender} />
                </Wrapper>
            </main>
        );
    }

    return (
        <main className='bg-zinc-950 w-full h-screen flex'>
            <Wrapper>
                <SidebarChat listSender={listSender} />
            </Wrapper>
            <section className='hidden w-full xl:flex flex-col h-screen xl:w-4/6 bg-zinc-950 bg-fixed justify-center items-center'>
                {children}
            </section>
        </main>
    );
}
