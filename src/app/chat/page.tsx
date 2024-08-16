'use client';
import { useSession } from 'next-auth/react';
import { ProfileAvatar } from './avatar';
import useSWR from 'swr';
import Image from 'next/image';
import Link from 'next/link';
import Loading from '@/components/loading';
import Wrapper from './wrapper';

interface Result {
    pp: string;
    name: string;
    wa_number: string;
    fromMe: boolean;
    latestMessageText: string;
    latestMessageTimestamp: string;
    id_user: string;
}

export default function ChatPage() {
    const { data: session, status }: { data: any; status: string } =
        useSession();
    const user_id: string | undefined | null = session?.user?.user_id;

    const options: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_id
        }),
        cache: 'no-store'
    };
    const fetcher = (url: string) =>
        fetch(url, options).then(res => res.json());
    const { data, error, isLoading } = useSWR(
        'https://chat-app-rouge-alpha.vercel.app/api/get_list_sender',
        fetcher
    );
    let listSender: Array<Result> | undefined = data?.result;

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

    return (
        <Wrapper>
            <div className='w-full flex flex-col gap-3 p-6 flex-grow'>
                {!listSender ? (
                    <div className='w-full flex justify-center gap-1.5 items-center text-lg font-medium text-zinc-500'>
                        <Loading /> Loading your chats...
                    </div>
                ) : listSender?.length !== 0 ? (
                    listSender?.map((sender: Result, index: number) => (
                        <Link
                            href={`/chat/mobile/${sender?.id_user}`}
                            key={index}
                            className='w-full rounded-xl bg-zinc-800/[0.5] flex justify-between items-center p-3'
                        >
                            <div className='w-8/12 flex gap-3 items-center'>
                                {sender?.pp === 'empety' ? (
                                    <h1 className='text-2xl sm:text-3xl md:text-4xl text-zinc-300'>
                                        <ProfileAvatar username='beni' />
                                    </h1>
                                ) : (
                                    <Image
                                        alt='user profile'
                                        src={sender?.pp}
                                        width={50}
                                        height={50}
                                        loading='lazy'
                                        className='rounded-full'
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
    );
}
