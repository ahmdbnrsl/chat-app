'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';
import { FetcherService } from '@/services/fetcherService';
import type { SenderMessage } from '@/types';
import { io } from 'socket.io-client';
import { Message, User, ID } from '@/types';
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
                setListSender(
                    (
                        prevData: SenderMessage[] | undefined | null
                    ): SenderMessage[] => {
                        if (!prevData) return [];
                        const mess_id = newData.message_id;
                        const findNewMessage: SenderMessage | undefined = (
                            prevData as SenderMessage[]
                        ).find(
                            ({
                                latestMessageSenderId,
                                latestMessageReceiverId
                            }) =>
                                latestMessageSenderId === newData.sender_id &&
                                latestMessageReceiverId === newData.receiver_id
                        );
                        console.log(findNewMessage);
                        console.log(mess_id);
                        if (findNewMessage) {
                            findNewMessage.fromMe =
                                newData?.sender_id !== session?.user?.user_id;
                            findNewMessage.latestMessageId = newData.message_id;
                            findNewMessage.latestMessageText =
                                newData?.message_text;
                            findNewMessage.latestMessageTimestamp =
                                newData?.message_timestamp;
                            findNewMessage.latestMessageIdOnDB =
                                newData?._id as ID;
                            findNewMessage.is_readed = newData?.is_readed;
                            findNewMessage.unReadedMessageLength =
                                newData?.sender_id !== session?.user?.user_id
                                    ? findNewMessage.unReadedMessageLength + 1
                                    : findNewMessage.unReadedMessageLength;
                            return prevData as SenderMessage[];
                        } else {
                            const newSender =
                                newData.sender_id !== session?.user?.user_id
                                    ? newData.sender_id
                                    : newData.receiver_id;

                            fetchSenderInfo(newSender).then(
                                (senderInfo: User | undefined) => {
                                    if (senderInfo)
                                        (prevData as SenderMessage[]).push({
                                            pp: senderInfo?.pp as ID,
                                            name: senderInfo?.name as ID,
                                            wa_number:
                                                senderInfo?.wa_number as ID,
                                            fromMe:
                                                newData?.sender_id !==
                                                session?.user?.user_id,
                                            latestMessageId: newData.message_id,
                                            latestMessageText:
                                                newData.message_text,
                                            latestMessageTimestamp:
                                                newData.message_timestamp,
                                            latestMessageSenderId:
                                                newData.sender_id,
                                            latestMessageIdOnDB:
                                                newData._id as ID,
                                            id_user: newSender,
                                            is_readed: newData.is_readed,
                                            unReadedMessageLength:
                                                newData.sender_id !==
                                                session?.user?.user_id
                                                    ? 1
                                                    : 0
                                        });
                                }
                            );
                            return prevData as SenderMessage[];
                        }
                    }
                );
            }
        };

        const handleReadMessage = (readedMessageId: string) => {
            setListSender(
                (
                    prevData: SenderMessage[] | undefined | null
                ): SenderMessage[] => {
                    if (!prevData) return [];
                    let messageReaded: SenderMessage | undefined = (
                        prevData as SenderMessage[]
                    ).find(
                        (sender: SenderMessage) =>
                            sender.latestMessageIdOnDB === readedMessageId
                    );
                    if (messageReaded) {
                        messageReaded.is_readed = true;
                        messageReaded.unReadedMessageLength = 0;
                    }
                    return prevData as SenderMessage[];
                }
            );
        };

        socket.on('connect', () => console.info('live chat opened'));
        socket.on('data_updated', handleDataUpdated);
        socket.on('data_deleted', () => fetchListSender());
        socket.on('message_readed', handleReadMessage);
        socket.on('disconnect', () => console.info('live chat closed'));

        return () => {
            socket.off('data_updated', handleDataUpdated);
            socket.off('data_deleted');
            socket.off('message_readed', handleReadMessage);
        };
    }, [fetchListSender, session?.user?.user_id, fetchSenderInfo]);

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
