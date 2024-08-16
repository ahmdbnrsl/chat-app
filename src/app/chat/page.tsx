'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaRegCircleUser } from 'react-icons/fa6';
import { ProfileAvatar, ProfileAvatar2 } from './avatar';
import { useSession } from 'next-auth/react';
import { getListSender } from './get_list_sender';
import Modal from './modal';
import Loading from '@/components/loading';

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
    const [listSender, setListSender] = useState<
        undefined | null | Array<Result>
    >(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [load, setLoad] = useState<boolean>(true);
    const { data: session, status }: { data: any; status: string } =
        useSession();
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
        if (!session?.user?.user_id) return;
        const fetchListSender = async () => {
            const res = await getListSender(session.user.user_id);
            if (res && res.status) {
                setListSender(res.result);
                setLoad(false);
            }
        };
        const interval = setInterval(fetchListSender, 5000);
        return () => clearInterval(interval);
    }, [session?.user?.user_id]);
    return (
        <main className='bg-zinc-900 w-full min-h-screen flex'>
            {showModal && (
                <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-zinc-500/[0.15] backdrop-blur p-4'>
                    <div
                        onClick={() => setShowModal(false)}
                        className='fixed flex justify-center items-center inset-0 z-51 overflow-x-hidden overflow-y-auto outline-none focus:outline-none'
                    ></div>
                    <Modal
                        name={session?.user?.name}
                        wa_number={session?.user?.wa_number}
                        created_at={session?.user?.created_at}
                        pp={session?.user?.pp}
                    />
                </div>
            )}
            <section className='w-full flex flex-col min-h-screen xl:w-1/3'>
                <nav className='sticky top-0 z-20 bg-zinc-900 w-full py-4 px-6 flex flex-col border-b border-zinc-800 items-center'>
                    <div className='flex justify-between w-full items-center'>
                        <h1 className='text-zinc-200 text-lg sm:text-xl font-semibold tracking-normal'>
                            Chats
                        </h1>
                        <button
                            onClick={() => setShowModal(true)}
                            className='text-zinc-300 font-medium text-lg sm:text-xl md:text-2xl outline-0 bg-transparent border-0 rounded-full'
                        >
                            <ProfileAvatar2 username={session?.user?.name} />
                        </button>
                    </div>
                    <input
                        type='text'
                        placeholder='Search by name'
                        className='mt-2 w-full py-2 px-4 text-zinc-300 font-normal text-base sm:text-lg rounded-lg bg-zinc-800/[0.5] outline-0 border-2 border-zinc-800 focus:border-zinc-700 placeholder:text-zinc-400 placeholder:text-sm sm:placeholder:text-base'
                    />
                </nav>
                <div className='w-full flex flex-col gap-3 p-6 flex-grow'>
                    {load ? (
                        <div className='w-full flex justify-center gap-1.5 items-center text-lg font-medium text-zinc-500'>
                            <Loading /> Loading your chats...
                        </div>
                    ) : (
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
                    )}
                </div>
                <div className='sticky bottom-0 bg-zinc-900 w-full py-4 px-6 flex flex-col border-t border-zinc-800 items-center'>
                    <button className='bg-zinc-200 rounded-full py-1.5 px-6 outline-0 text-zinc-950 text-center'>
                        + Start Chat
                    </button>
                </div>
            </section>
            <section className='hidden min-h-screen xl:flex w-4/6 bg-zinc-950 bg-ornament'></section>
        </main>
    );
}
