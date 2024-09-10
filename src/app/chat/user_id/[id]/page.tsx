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
import { useManageQuoted, useUpdatedListMessage } from '@/lib/zustand';

const socketURL: string = process.env.NEXT_PUBLIC_SOCKET_URL || '';
const socket: Socket = io(socketURL);

export default function ChatPage({
    params
}: {
    params: { id: string };
}): JSX.Element {
    const { data: session, status }: { data: any; status: string } =
        useSession();
    const {
        listMessage,
        setListMessage,
        setNewUpdatedListMessage,
        setNewDeletedListMessage,
        clearListMessage
    } = useUpdatedListMessage();
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
    }, [session?.user?.user_id, params.id, resetQuoted, setListMessage]);

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
                setNewUpdatedListMessage(newData);
                readMessages();
            }
        };

        const handleMessageDeleted = (deletedMessageId: string): void => {
            if (!deletedMessageId) return;
            setNewDeletedListMessage(deletedMessageId);
        };

        socket.on('connect', () => console.info('live chat opened'));
        socket.on('data_updated', handleMessageUpdated);
        socket.on('data_deleted', handleMessageDeleted);
        socket.on('disconnect', () => console.info('live chat closed'));

        return () => {
            socket.off('data_updated', handleMessageUpdated);
            socket.off('data_deleted', handleMessageDeleted);
        };
    }, [
        fetchSenderInfo,
        fetchMessages,
        session?.user?.user_id,
        params.id,
        readMessages,
        setNewDeletedListMessage,
        setNewUpdatedListMessage
    ]);

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
