'use client';

import ListMessages from './ListMessages';
import NavbarChat from './Navbar';
import FormMessage from './formMessage';
import LoadingMessage from '@/components/loading';
import StartButton from '@/components/Buttons/start';
import Avatar from 'react-avatar';
import Image from 'next/image';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { FetcherService } from '@/services/fetcherService';
import { io, Socket } from 'socket.io-client';
import type { M, DateGroup, Message, User, ID, SenderGroup } from '@/types';
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
        Array<DateGroup> | null | undefined
    >(null);
    const [senderInfo, setSenderInfo] = useState<undefined | null | User>(null);

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
            window.scrollTo(0, document.body.scrollHeight);
        }
    }, [session?.user?.user_id, params.id]);

    useEffect(() => {
        if (!session?.user?.user_id || !params.id) return;

        fetchSenderInfo();
        fetchMessages();

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
                        const updatedData: DateGroup[] = [
                            ...(prevData as DateGroup[])
                        ];
                        const messageDate: string = new Date(
                            parseInt(newData.message_timestamp)
                        ).toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        });

                        let dateGroup: DateGroup | undefined = updatedData.find(
                            group => group.date === messageDate
                        );
                        if (!dateGroup) {
                            dateGroup = { date: messageDate, messages: [] };
                            updatedData.push(dateGroup);
                        }

                        let senderGroup: SenderGroup | undefined =
                            dateGroup.messages.find(
                                group => group.sender_id === newData.sender_id
                            );
                        if (!senderGroup) {
                            senderGroup = {
                                sender_id: newData.sender_id,
                                messages: []
                            };
                            dateGroup.messages.push(senderGroup);
                        }

                        const existingMessageIndex: number =
                            senderGroup.messages.findIndex(
                                msg => msg.message_id === newData.message_id
                            );
                        if (existingMessageIndex > -1) {
                            senderGroup.messages[existingMessageIndex] = {
                                message_text: newData.message_text,
                                message_id: newData.message_id,
                                message_timestamp: newData.message_timestamp,
                                _id: newData._id as ID
                            };
                        } else {
                            senderGroup.messages.push({
                                message_text: newData.message_text,
                                message_id: newData.message_id,
                                message_timestamp: newData.message_timestamp,
                                _id: newData._id as ID
                            });
                        }

                        return updatedData;
                    }
                );
            }
        };

        const handleMessageDeleted = (deletedMessageId: string): void => {
            if (!deletedMessageId) return;
            console.log(listMessage);
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
                <section className='w-full flex flex-col min-h-screen bg-fixed bg-zinc-950 justify-center items-center'>
                    <h1 className='flex items-center gap-2 sm:gap-3 text-lg sm:text-xl md:text-2xl text-zinc-400 font-medium text-center scale-[3]'>
                        <LoadingMessage />
                    </h1>
                </section>
            ) : (
                <section className='w-full flex flex-col h-screen bg-ornament bg-fixed bg-zinc-950'>
                    <NavbarChat senderInfo={senderInfo} />
                    {listMessage.length !== 0 ? (
                        <ListMessages
                            listMessage={listMessage as Array<DateGroup>}
                            senderInfo={senderInfo as User}
                        />
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
