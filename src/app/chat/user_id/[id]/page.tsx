'use client';
import ListMessage from './listMessage';
import NavbarChat from './Navbar';
import FormMessage from './formMessage';
import LoadingMessage from '@/components/loading';
import Avatar from 'react-avatar';
import Image from 'next/image';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { FetcherService } from '@/services/fetcherService';
import { io, Socket } from 'socket.io-client';
import type { M, Message, User } from '@/types';
import { date, hour } from '@/services/getTime';

const socketURL: string = process.env.NEXT_PUBLIC_SOCKET_URL || '';
const socket: Socket = io(socketURL);

export default function ChatPage({
    params
}: {
    params: { id: string };
}): JSX.Element {
    const { data: session, status }: { data: any; status: string } =
        useSession();
    const [listMessage, setListMessage] = useState<
        Array<Message> | null | undefined
    >(null);
    const [senderInfo, setSenderInfo] = useState<undefined | null | User>(null);

    const getDate = useCallback(date, []);
    const getTimestamp = useCallback(hour, []);

    const fetchSenderInfo = useCallback(async (): Promise<void> => {
        if (!params.id) return;
        const res = await FetcherService(
            { user_id: params.id },
            { path: 'get_user_info', method: 'POST' }
        );
        if (res && res?.status) setSenderInfo(res.result as User);
    }, [params.id]);

    const fetchMessages = useCallback(async (): Promise<void> => {
        if (!session?.user?.user_id || !params.id) return;
        const res = await FetcherService(
            { sender_id: session.user.user_id, receiver_id: params.id },
            {
                path: 'get_messages',
                method: 'POST'
            }
        );
        if (res && res?.status) {
            setListMessage((res.result as Array<Message>)?.reverse());
        }
    }, [session?.user?.user_id, params.id]);

    useEffect(() => {
        if (!session?.user?.user_id || !params.id) return;

        fetchSenderInfo();
        fetchMessages();

        const handleDataUpdated = (newData: Message): void => {
            if (!newData) return;
            if (
                (newData.sender_id === session.user.user_id &&
                    newData.receiver_id === params.id) ||
                (newData.sender_id === params.id &&
                    newData.receiver_id === session.user.user_id)
            ) {
                setListMessage(
                    (prevData: Array<Message> | null | undefined) => {
                        const updatedMessages = prevData
                            ? [newData, ...(prevData as Array<Message>)]
                            : [newData];

                        return updatedMessages;
                    }
                );
            }
        };

        socket.on('connect', () => console.info('live chat opened'));
        socket.on('data_updated', handleDataUpdated);
        socket.on('data_deleted', () => fetchMessages());
        socket.on('disconnect', () => console.info('live chat closed'));

        return () => {
            socket.off('data_updated', handleDataUpdated);
            socket.off('data_deleted');
        };
    }, [fetchSenderInfo, fetchMessages, session?.user?.user_id, params.id]);

    return (
        <main className='bg-zinc-950 w-full min-h-screen flex'>
            {!listMessage ? (
                <section className='w-full flex flex-col min-h-screen bg-fixed bg-zinc-950 justify-center items-center'>
                    <h1 className='flex items-center gap-2 sm:gap-3 text-lg sm:text-xl md:text-2xl text-zinc-400 font-medium text-center scale-[3]'>
                        <LoadingMessage />
                    </h1>
                </section>
            ) : (
                <section className='w-full flex flex-col min-h-screen bg-ornament bg-fixed bg-zinc-950'>
                    <NavbarChat senderInfo={senderInfo} />
                    {listMessage.length !== 0 ? (
                        <div className='w-full flex flex-col-reverse gap-3 p-6 flex-grow max-h-screen overflow-y-auto'>
                            {listMessage.map((message: Message, i: number) => {
                                let checkDate: string | null =
                                    i === listMessage.length - 1 ||
                                    getDate(message?.message_timestamp) !==
                                        getDate(
                                            listMessage[i + 1].message_timestamp
                                        )
                                        ? getDate(message?.message_timestamp)
                                        : null;
                                return (
                                    <ListMessage
                                        key={message?.message_timestamp}
                                        checkDate={checkDate}
                                        timestamp={getTimestamp(
                                            message?.message_timestamp
                                        )}
                                        message={message}
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        <div className='w-full flex flex-col justify-center items-center p-6 flex-grow bg-zinc-950'>
                            {senderInfo && senderInfo.pp !== 'empety' ? (
                                <Image
                                    src={senderInfo.pp}
                                    width={100}
                                    height={100}
                                    alt='user profile'
                                    loading='lazy'
                                    className='rounded-full border border-zinc-700'
                                />
                            ) : (
                                <Avatar
                                    name={senderInfo?.name}
                                    size='100'
                                    round={true}
                                />
                            )}
                            <h1 className='flex items-center gap-2 sm:gap-3 text-lg sm:text-xl md:text-2xl text-zinc-300 font-bold text-center'>
                                {senderInfo?.name}
                            </h1>
                            <p className='text-zinc-500 font-medium text-sm sm:text-base text-center'>
                                +{senderInfo?.wa_number}
                            </p>
                            <p className='text-zinc-500 font-medium text-sm sm:text-xs text-center'>
                                {senderInfo?.user_id}
                            </p>
                            <button
                                onClick={() =>
                                    (
                                        document.querySelector(
                                            '.form_sendmessage'
                                        ) as HTMLTextAreaElement
                                    ).focus()
                                }
                                type='button'
                                className='flex justify-center items-center px-4 py-2  cursor-pointer bg-gradient-to-br from-zinc-200 to-zinc-400 text-zinc-950 text-lg rounded-full outline-0 font-medium'
                            >
                                Start Chatting
                            </button>
                        </div>
                    )}
                    <FormMessage
                        paramsId={params.id}
                        userId={session?.user?.user_id}
                        isDisabled={!listMessage ? true : false}
                    />
                </section>
            )}
        </main>
    );
}
