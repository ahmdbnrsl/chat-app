'use client';
import ListMessage from './listMessage';
import NavbarChat from './Navbar';
import FormMessage from './formMessage';
import Loading from '@/components/loading';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { getListMessage, getSenderInfo } from './message_service';
import { Message } from '@/models/messages';
import { User } from '@/models/users';
import { io } from 'socket.io-client';

const socketURL = process.env.NEXT_PUBLIC_SOCKET_URL || '';
const socket = io(socketURL);

export default function MobileView(props: any) {
    const { data: session, status }: { data: any; status: string } =
        useSession();
    const [listMessage, setListMessage] = useState<
        undefined | null | Array<Message>
    >(null);
    const [senderInfo, setSenderInfo] = useState<undefined | null | User>(null);
    const { params } = props;

    useEffect(() => {
        if (!session?.user?.user_id || !params.id) return;

        const fetchSenderInfo = async () => {
            const res = await getSenderInfo(params.id);
            if (res && res.status) setSenderInfo(res.result);
        };

        const fetchMessages = async () => {
            const res = await getListMessage(session.user.user_id, params.id);
            if (res && res.status) {
                setListMessage(res.result?.reverse());
            }
        };

        fetchSenderInfo();
        fetchMessages();

        socket.on('connect', () => {
            console.info('live chat opened');
        });

        socket.on('data_updated', (newData: Message) => {
            if (!newData) return;
            if (
                (newData.sender_id === session?.user.user_id &&
                    newData.receiver_id === params.id) ||
                (newData.sender_id === params.id &&
                    newData.receiver_id === session?.user?.user_id)
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
        });

        socket.on('data_deleted', () => fetchMessages());

        socket.on('disconnect', () => {
            console.info('live chat closed');
        });

        return () => {
            socket.off('data_updated');
        };
    }, [session?.user?.user_id, params.id]);

    const getTimestamp = useCallback((isDate: string): string => {
        const date = new Date(Number(isDate));
        return `${String(date.getHours()).padStart(2, '0')}:${String(
            date.getMinutes()
        ).padStart(2, '0')}`;
    }, []);

    const getDate = (isDate: string): string => {
        const date: Date = new Date(Number(isDate));
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
            <section className='w-full flex flex-col min-h-screen bg-ornament bg-fixed bg-zinc-950'>
                <NavbarChat senderInfo={senderInfo} />
                <div className='w-full flex flex-col-reverse gap-3 p-6 flex-grow'>
                    {!listMessage ? (
                        <div className='w-full flex justify-center gap-1.5 items-center text-lg font-medium text-zinc-500'>
                            <Loading /> Loading messages...
                        </div>
                    ) : (
                        listMessage.map((message: Message, i: number) => {
                            let checkDate: string | null = null;
                            if (i === 0) {
                                checkDate = getDate(message?.message_timestamp);
                            } else if (
                                getDate(message?.message_timestamp) !==
                                getDate(listMessage[i - 1].message_timestamp)
                            ) {
                                checkDate = getDate(message?.message_timestamp);
                            }
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
                        })
                    )}
                </div>
                <FormMessage
                    paramsId={params.id}
                    userId={session?.user?.user_id}
                    isDisabled={!listMessage ? true : false}
                />
            </section>
        </main>
    );
}
