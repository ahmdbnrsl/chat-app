'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaRegCircleUser } from 'react-icons/fa6';
import { ProfileAvatar, ProfileAvatar2 } from './avatar';
import { useSession } from 'next-auth/react';
import { getListSender } from './get_list_sender';
import Modal from './modal';

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
    const { data: session, status }: { data: any; status: string } =
        useSession();
    useEffect(() => {
        if (session?.user?.user_id) {
            getListSender(session.user.user_id).then(
                (
                    res:
                        | {
                              status: boolean;
                              message: string;
                              result?: Array<Result>;
                          }
                        | false
                ) => {
                    if (res && res.status) {
                        setListSender(res.result);
                    }
                }
            );
        }
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
            <section className='w-full min-h-screen lg:w-1/3'>
                <nav className='w-full py-4 px-6 flex justify-between border-b border-zinc-800 items-center'>
                    <button className='px-3 text-zinc-300 font-medium text-base sm:text-lg md:text-xl outline-0 bg-transparent border-0 rounded-lg hover:bg-zinc-800'>
                        Edit
                    </button>
                    <h1 className='text-zinc-200 text-xl sm:text-2xl md:text-3xl font-bold tracking-normal'>
                        Chats
                    </h1>
                    <button
                        onClick={() => setShowModal(true)}
                        className='p-3 text-zinc-300 font-medium text-lg sm:text-xl md:text-2xl outline-0 bg-transparent border-0 rounded-full hover:bg-zinc-800'
                    >
                        <ProfileAvatar2 username={session?.user?.name} />
                    </button>
                </nav>
                <div className='w-full flex flex-col gap-3 p-6'>
                    {listSender &&
                        listSender?.map((sender: Result, index: number) => (
                            <Link
                                href={`/chat/${sender?.id_user}`}
                                key={index}
                                className='w-full rounded-xl bg-zinc-800 flex justify-between items-center p-3'
                            >
                                <div className='w-10/12 flex gap-3 items-center'>
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
                                        <h1 className='text-base sm:text-lg text-zinc-200 font-bold'>
                                            {sender?.name}
                                        </h1>
                                        <p className='text-xs sm:text-sm md:text-base text-zinc-400'>
                                            {sender?.latestMessageText}
                                        </p>
                                    </div>
                                </div>
                                <button className='text-2xl sm:text-3xl md:text-4xl text-zinc-500 px-3'>
                                    ⟩
                                </button>
                            </Link>
                        ))}
                </div>
            </section>
            <section className='hidden lg:min-h-screen lg:flex lg:w-4/6 lg:bg-zinc-950 lg:bg-ornament'></section>
        </main>
    );
}
