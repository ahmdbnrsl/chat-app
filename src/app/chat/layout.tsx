'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';
import { FetcherService } from '@/services/fetcherService';
import type { SenderMessage } from '@/types';
import { io } from 'socket.io-client';
import { Message, User, ID } from '@/types';
import { usePathname } from 'next/navigation';
import { useUpdatedSenderNewMessage } from '@/lib/zustand';
import SidebarChat from './Sidebar';
import Wrapper from './Wrapper';
const socketURL = process.env.NEXT_PUBLIC_SOCKET_URL || '';
const socket = io(socketURL);

export default function Layout({ children }: { children: React.ReactNode }) {
    const { data: session, status }: { data: any; status: string } =
        useSession();
    const [width, setWidth] = useState<number>(0);
    const {
        listSender,
        setListSender,
        setNewMessageListSender,
        setReadMessageListSender
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

        const handleDataUpdated = (newData: Message) => {
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

        const handleDataDeleted = (deletedMessageId: string) => {
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

        socket.on('connect', () => console.info('live chat opened'));
        socket.on('data_updated', handleDataUpdated);
        socket.on('data_deleted', handleDataDeleted);
        socket.on('message_readed', handleReadMessage);
        socket.on('disconnect', () => console.info('live chat closed'));

        return () => {
            socket.off('data_updated', handleDataUpdated);
            socket.off('data_deleted', handleDataDeleted);
            socket.off('message_readed', handleReadMessage);
        };
    }, [
        fetchListSender,
        session?.user?.user_id,
        fetchSenderInfo,
        setReadMessageListSender,
        setNewMessageListSender,
        listSender
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
