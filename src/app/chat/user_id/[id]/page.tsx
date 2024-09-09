'use client';

import ListMessages from './ListMessages';
import NavbarChat from './Navbar';
import FormMessage from './FormMessage';
import LoadingMessage from '@/components/loading';
import StartButton from '@/components/Buttons/start';
import Avatar from 'react-avatar';
import Image from 'next/image';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { FetcherService } from '@/services/fetcherService';
import { io, Socket } from 'socket.io-client';
import type {
    M,
    DateGroup,
    Message,
    User,
    ID,
    SenderGroup,
    GroupedMessage
} from '@/types';
import { date, hour } from '@/services/getTime';
import { useManageQuoted } from '@/lib/zustand';

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
        Array<DateGroup> | null | undefined
    >(null);
    const [senderInfo, setSenderInfo] = useState<undefined | null | User>(null);
    const { reset: resetQuoted } = useManageQuoted();

    const getDate = useCallback(date, []);
    const getTimestamp = useCallback(hour, []);

    const handleStart = () =>
        (
            document.querySelector('.form_sendmessage') as HTMLTextAreaElement
        ).focus();

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
            setListMessage(res.result as Array<DateGroup>);
            resetQuoted();
            window.scrollTo(0, document.body.scrollHeight);
        }
    }, [session?.user?.user_id, params.id]);

    const readMessages = useCallback(async (): Promise<void> => {
        if (!session?.user?.user_id || !params.id) return;
        const res = await FetcherService(
            {
                sender_id: params.id,
                receiver_id: session.user.user_id,
                read_at: Date.now().toString()
            },
            {
                path: 'read_message',
                method: 'PATCH'
            }
        );
    }, [session?.user?.user_id, params.id]);

    useEffect(() => {
        if (!session?.user?.user_id || !params.id) return;

        fetchSenderInfo();
        fetchMessages();
        readMessages();

        const handleMessageUpdated = (newData: Message): void => {
            if (!newData) return;
            if (
                (newData.sender_id === session.user.user_id &&
                    newData.receiver_id === params.id) ||
                (newData.sender_id === params.id &&
                    newData.receiver_id === session.user.user_id)
            ) {
                setListMessage(
                    (prevData: DateGroup[] | null | undefined): DateGroup[] => {
                        if (!prevData) return [];

                        const newMessageDate = new Date(
                            parseInt(newData.message_timestamp)
                        ).toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        });

                        let dateGroup: DateGroup = prevData.find(
                            group => group.date === newMessageDate
                        );

                        if (!dateGroup) {
                            dateGroup = {
                                date: newMessageDate,
                                messages: []
                            };
                            prevData = [...prevData, dateGroup];
                        }

                        const messagesInDateGroup = dateGroup.messages;

                        const lastSenderGroup =
                            messagesInDateGroup.length > 0
                                ? messagesInDateGroup[
                                      messagesInDateGroup.length - 1
                                  ]
                                : null;

                        if (
                            !lastSenderGroup ||
                            lastSenderGroup.sender_id !== newData.sender_id
                        ) {
                            messagesInDateGroup.push({
                                sender_id: newData.sender_id,
                                messages: [
                                    {
                                        message_text: newData.message_text,
                                        message_id: newData.message_id,
                                        message_timestamp:
                                            newData.message_timestamp,
                                        message_quoted: newData?.message_quoted,
                                        is_readed: newData?.is_readed,
                                        read_at: newData?.read_at,
                                        _id: newData._id as ID
                                    }
                                ]
                            });
                        } else {
                            lastSenderGroup.messages = [
                                ...lastSenderGroup.messages,
                                {
                                    message_text: newData.message_text,
                                    message_id: newData.message_id,
                                    message_timestamp:
                                        newData.message_timestamp,
                                    message_quoted: newData?.message_quoted,
                                    is_readed: newData?.is_readed,
                                    read_at: newData?.read_at,
                                    _id: newData._id as ID
                                }
                            ];
                        }

                        dateGroup.messages.forEach(group => {
                            group.messages.sort(
                                (a, b) =>
                                    Number(a.message_timestamp) -
                                    Number(b.message_timestamp)
                            );
                        });

                        return prevData.sort(
                            (a, b) =>
                                new Date(a.date).getTime() -
                                new Date(b.date).getTime()
                        );
                    }
                );
                readMessages();
            }
        };

        const handleMessageDeleted = (deletedMessageId: string): void => {
            if (!deletedMessageId) return;

            setListMessage(
                (prevData: DateGroup[] | null | undefined): DateGroup[] => {
                    if (!prevData) return [];
                    const updatedData: DateGroup[] = prevData.map(
                        (dateGroup: DateGroup) => {
                            const updatedMessages: SenderGroup[] =
                                dateGroup.messages
                                    .map((senderGroup: SenderGroup) => ({
                                        ...(senderGroup as SenderGroup),
                                        messages: senderGroup.messages.filter(
                                            (message: GroupedMessage) =>
                                                message._id !== deletedMessageId
                                        )
                                    }))
                                    .filter(
                                        (senderGroup: SenderGroup) =>
                                            senderGroup.messages.length > 0
                                    );

                            return {
                                ...(dateGroup as DateGroup),
                                messages: updatedMessages
                            };
                        }
                    );

                    return updatedData.filter(
                        (dateGroup: DateGroup) => dateGroup.messages.length > 0
                    );
                }
            );
        };

        socket.on('connect', () => console.info('live chat opened'));
        socket.on('data_updated', handleMessageUpdated);
        socket.on('data_deleted', handleMessageDeleted);
        socket.on('disconnect', () => console.info('live chat closed'));

        return () => {
            socket.off('data_updated', handleMessageUpdated);
            socket.off('data_deleted', handleMessageDeleted);
        };
    }, [fetchSenderInfo, fetchMessages, session?.user?.user_id, params.id]);

    return (
        <main className='bg-zinc-950 w-full min-h-screen flex'>
            {!listMessage ? (
                <section className='w-full flex flex-col h-screen bg-fixed bg-zinc-950 justify-center items-center'>
                    <h1 className='flex items-center gap-2 sm:gap-3 text-lg sm:text-xl md:text-2xl text-zinc-400 font-medium text-center scale-[3]'>
                        <LoadingMessage />
                    </h1>
                </section>
            ) : (
                <section className='w-full flex flex-col h-screen bg-ornament bg-fixed bg-zinc-950 overflow-y-auto'>
                    <NavbarChat senderInfo={senderInfo} />
                    {listMessage.length !== 0 ? (
                        <div className='w-full flex flex-col flex-grow justify-end'>
                            <ListMessages
                                listMessage={listMessage as Array<DateGroup>}
                                senderInfo={senderInfo as User}
                            />
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
                            <p className='text-zinc-500 font-medium text-sm sm:text-xs text-center mb-3'>
                                {senderInfo?.user_id}
                            </p>
                            <StartButton onClicking={handleStart}>
                                Start Chatting
                            </StartButton>
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
