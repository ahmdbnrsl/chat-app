'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';
import { FetcherService } from '@/services/fetcherService';
import type { SenderMessage } from '@/types';
import { type Socket } from 'socket.io-client';
import { Message, User, ID } from '@/types';
import { usePathname } from 'next/navigation';
import { useUpdatedSenderNewMessage } from '@/lib/zustand';
import { initializeSocket } from '@/lib/socketService';
import SidebarChat from './Sidebar';
import Wrapper from './Wrapper';

export default function Layout({ children }: { children: React.ReactNode }) {
    const { data: session, status }: { data: any; status: string } =
        useSession();
    const [width, setWidth] = useState<number>(0);
    const {
        listSender,
        setListSender,
        setNewMessageListSender,
        setReadMessageListSender,
        setOnlineOffline
    } = useUpdatedSenderNewMessage();

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
    }, [session?.user.user_id, setListSender]);

    const fetchSenderInfo = useCallback(
        async (user_id: string): Promise<User | undefined> => {
            if (!user_id) return;
            const res = await FetcherService(
                { user_id },
                { path: 'get_user_info', method: 'POST' }
            );
            if (res && res?.status) return res.result as User;
            return;
        },
        []
    );

    useEffect(() => {
        if (!session?.user?.user_id) return;

        fetchListSender();

        const handleNewMessage = (newData: Message) => {
            if (!newData) return;
            if (
                newData.sender_id === session?.user.user_id ||
                newData.receiver_id === session?.user?.user_id
            ) {
                setNewMessageListSender(
                    newData,
                    session?.user?.user_id as string,
                    fetchSenderInfo
                );
            }
        };

        const handleMessageDeleted = (deletedMessageId: string) => {
            if (listSender && listSender.length > 0) {
                let findDeletedMessId: SenderMessage | undefined =
                    listSender.find(
                        (sender: SenderMessage) =>
                            sender.latestMessageIdOnDB === deletedMessageId
                    );
                if (findDeletedMessId) fetchListSender();
            }
        };

        const handleReadMessage = (readedMessageId: string) => {
            setReadMessageListSender(readedMessageId);
        };

        const handleUserStatus = (userId: string) => {
            setOnlineOffline(userId);
        };

        const socket = initializeSocket(session?.user?.user_id || '') as Socket;

        socket?.on('mess.insert.on.layout', handleNewMessage);
        socket?.on('mess.delete.on.layout', handleMessageDeleted);
        socket?.on('mess.update.on.layout', handleReadMessage);
        socket?.on('user_status', handleUserStatus);

        return () => {
            socket?.off('mess.insert.on.layout', handleNewMessage);
            socket?.off('mess.delete.on.layout', handleMessageDeleted);
            socket?.off('mess.update.on.layout', handleReadMessage);
            socket?.off('user_status', handleUserStatus);
        };
    }, [
        fetchListSender,
        session?.user?.user_id,
        fetchSenderInfo,
        setReadMessageListSender,
        setNewMessageListSender,
        setOnlineOffline,
        listSender,
        initializeSocket
    ]);

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
        if (
            pathName.startsWith('/chat/user_id') ||
            pathName.startsWith('/chat/ai')
        ) {
            return <>{children}</>;
        }
        return (
            <main className='bg-zinc-950 w-full h-screen flex'>
                <Wrapper>
                    <SidebarChat />
                </Wrapper>
            </main>
        );
    }

    return (
        <main className='bg-zinc-950 w-full h-screen flex'>
            <Wrapper>
                <SidebarChat />
            </Wrapper>
            <section className='hidden w-full xl:flex flex-col h-screen xl:w-4/6 bg-zinc-950 bg-fixed justify-center items-center'>
                {children}
            </section>
        </main>
    );
}
