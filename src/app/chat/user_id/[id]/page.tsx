'use client';
import ListMessage from './listMessage';
import NavbarChat from './Navbar';
import FormMessage from './formMessage';
import LoadingMessage from '@/components/loading';
import Avatar from 'react-avatar';
import Image from 'next/image';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { messFetcher as getListMessage } from '@/services/messages/messageService';
import { getUserInfo } from '@/services/users/getUserInfo';
import { Message } from '@/models/messages';
import { User } from '@/models/users';
import { io } from 'socket.io-client';
import type { M } from '@/types';

const socketURL = process.env.NEXT_PUBLIC_SOCKET_URL || '';
const socket = io(socketURL);

export default function MobileView(props: any) {
    const { data: session, status }: { data: any; status: string } =
        useSession();
    const [listMessage, setListMessage] = useState<
        M['Result']['result'] | null | undefined
    >(null);
    const [senderInfo, setSenderInfo] = useState<undefined | null | User>(null);
    const { params } = props;

    useEffect(() => {
        if (!session?.user?.user_id || !params.id) return;

        const fetchSenderInfo = async () => {
            const res = await getUserInfo({ user_id: params.id });
            if (res && res.status) setSenderInfo(res.result);
        };

        const fetchMessages = async () => {
            const res = await getListMessage(
                { sender_id: session.user.user_id, receiver_id: params.id },
                { path: 'get_messages', method: 'POST' }
            );
            if (res && res.status) {
                setListMessage(res.result?.reverse());
            }
        };

        fetchSenderInfo();
        fetchMessages();

        socket.on('connect', () => {
            console.info('live chat opened');
        });

        socket.on('data_updated', (newData: M['List']) => {
            if (!newData) return;
            if (
                (newData.sender_id === session?.user.user_id &&
                    newData.receiver_id === params.id) ||
                (newData.sender_id === params.id &&
                    newData.receiver_id === session?.user?.user_id)
            ) {
                setListMessage(
                    (prevData: M['Result']['result'] | null | undefined) => {
                        const updatedMessages = prevData
                            ? [newData, ...(prevData as M['Result']['result'])]
                            : [newData];

                        return updatedMessages;
                    }
                );
            }
        });

        socket.on('data_deleted', () => fetchMessages());

        socket.on('disconnect', () => {
            console.info('live chat closed');
        });

        return () => {
            socket.off('data_updated');
            socket.off('data_deleted');
        };
    }, [session?.user?.user_id, params.id]);

    const getTimestamp = useCallback((isDate: string | undefined): string => {
        const date = new Date(Number(isDate || '0'));
        return `${String(date.getHours()).padStart(2, '0')}:${String(
            date.getMinutes()
        ).padStart(2, '0')}`;
    }, []);

    const getDate = (isDate: string | undefined): string => {
        const date: Date = new Date(Number(isDate || '0'));
        const monthNames: string[] = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];
        const monthName: string = monthNames[date.getMonth()];
        return `${date.getFullYear()} ${monthName} ${String(
            date.getDate()
        ).padStart(2, '0')}`;
    };

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
                            {listMessage.map(
                                (message: M['List'], i: number) => {
                                    let checkDate: string | null =
                                        i === listMessage.length - 1 ||
                                        getDate(message?.message_timestamp) !==
                                            getDate(
                                                listMessage[i + 1]
                                                    .message_timestamp
                                            )
                                            ? getDate(
                                                  message?.message_timestamp
                                              )
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
                                }
                            )}
                        </div>
                    ) : (
                        <div className='w-full flex flex-col justify-center items-center p-6 flex-grow bg-zinc-950 gap-3'>
                            {senderInfo && senderInfo.pp !== 'empety' ? (
                                <Image
                                    src={senderInfo.pp}
                                    width={80}
                                    height={80}
                                    alt='user profile'
                                    loading='lazy'
                                    className='rounded-full border border-zinc-700'
                                />
                            ) : (
                                <Avatar
                                    name={senderInfo?.name}
                                    size='80'
                                    round={true}
                                />
                            )}
                            <h1 className='flex items-center gap-2 sm:gap-3 text-lg sm:text-xl md:text-2xl text-zinc-300 font-medium text-center'>
                                {senderInfo?.name}
                            </h1>
                            <p className='text-zinc-500 font-medium text-sm sm:text-base text-center'>
                                {senderInfo?.user_id}
                            </p>
                            <p className='text-zinc-500 font-medium text-sm sm:text-base text-center'>
                                {senderInfo?.wa_number}
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
