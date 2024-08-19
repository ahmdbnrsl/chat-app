'use client';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getListSender } from './get_list_sender';
import { io } from 'socket.io-client';
import { Message } from '@/models/messages';
import Avatar from 'react-avatar';
import Image from 'next/image';
import Link from 'next/link';
import Loading from '@/components/loading';
import Wrapper from './wrapper';

const socketURL = process.env.NEXT_PUBLIC_SOCKET_URL || '';
const socket = io(socketURL);

interface Result {
    pp: string;
    name: string;
    wa_number: string;
    fromMe: boolean;
    latestMessageText: string;
    latestMessageTimestamp: string;
    id_user: string;
}

export default function Layout({ children }: { children: React.ReactNode }) {
    const { data: session, status }: { data: any; status: string } =
        useSession();
    const [pathTo, setPathTo] = useState<string>('');
    const [listSender, setListSender] = useState<
        Array<Result> | null | undefined
    >(null);

    useEffect(() => {
        async function fetchListSender() {
            const res:
                | { result?: Array<Result>; status: boolean; message: string }
                | false = await getListSender(session?.user.user_id);
            if (res && res?.status) setListSender(res?.result);
        }

        fetchListSender();

        socket.on('connect', () => {
            console.info('live chat opened');
        });

        socket.on('data_updated', (newData: Message) => {
            if (!newData) return;
            if (
                newData.sender_id === session?.user.user_id ||
                newData.receiver_id === session?.user?.user_id
            ) {
                fetchListSender();
            }
        });

        socket.on('data_deleted', () => fetchListSender());

        socket.on('disconnect', () => {
            console.info('live chat closed');
        });

        return () => {
            socket.off('data_updated');
            socket.off('data_deleted');
        };
    }, [session?.user?.user_id]);

    const getTimestamp = (isDate: string): string => {
        const date: Date = new Date(Number(isDate));
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
            2,
            '0'
        )}-${String(date.getDate()).padStart(2, '0')} ${String(
            date.getHours()
        ).padStart(2, '0')}:${String(date.getMinutes()).padStart(
            2,
            '0'
        )}:${String(date.getSeconds()).padStart(2, '0')}`;
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1280) {
                setPathTo('/chat/mobile/');
            } else {
                setPathTo('/chat/dekstop/');
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const pathname = usePathname();

    if (pathname.startsWith('/chat/mobile/')) {
        return <>{children}</>;
    }

    return (
        <main className='bg-zinc-950 w-full min-h-screen flex'>
            <Wrapper>
                <div className='w-full flex flex-col gap-3 p-6 flex-grow'>
                    {!listSender ? (
                        <div className='w-full flex justify-center gap-1.5 items-center text-lg font-medium text-zinc-500'>
                            <Loading /> Loading your chats...
                        </div>
                    ) : listSender?.length !== 0 ? (
                        listSender?.map((sender: Result, index: number) => (
                            <Link
                                href={`${pathTo}${sender?.id_user}`}
                                key={index}
                                className='w-full rounded-xl transition-colors hover:bg-zinc-900/[0.85] flex justify-between items-center p-3'
                            >
                                <div className='w-8/12 flex gap-3 items-center'>
                                    {sender?.pp !== 'empety' ? (
                                        <Image
                                            alt='User profile'
                                            src={sender?.pp}
                                            height={50}
                                            width={50}
                                            className='rounded-full'
                                            loading='lazy'
                                        />
                                    ) : (
                                        <Avatar
                                            name={sender?.name}
                                            size='50'
                                            round={true}
                                        />
                                    )}
                                    <div className='flex flex-col'>
                                        <h1 className='text-base sm:text-lg text-zinc-300 font-normal'>
                                            {sender?.name}
                                        </h1>
                                        <p className='w-[15ch] sm:w-[25ch] md:w-[50ch] xl:w-[15ch] text-xs sm:text-sm text-zinc-400 truncate'>
                                            {sender?.fromMe ? 'You : ' : ''}
                                            {sender?.latestMessageText}
                                        </p>
                                    </div>
                                </div>
                                <div className='w-1/4 flex flex-col justify-center items-end'>
                                    <p className='text-xs sm:text-sm font-normal text-zinc-400'>
                                        +{sender?.wa_number}
                                    </p>
                                    <p className='text-xs font-normal text-zinc-500'>
                                        {getTimestamp(
                                            sender?.latestMessageTimestamp
                                        )}
                                    </p>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className='w-full flex justify-center gap-1.5 items-center text-lg font-medium text-zinc-500'>
                            No chat found
                        </div>
                    )}
                </div>
            </Wrapper>
            <section className='hidden w-full xl:flex flex-col min-h-screen xl:w-4/6 bg-zinc-950 bg-ornament bg-fixed justify-center items-center'>
                {children}
            </section>
        </main>
    );
}
