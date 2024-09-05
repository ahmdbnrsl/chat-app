'use client';

import Avatar from 'react-avatar';
import Image from 'next/image';
import Link from 'next/link';
import { FaPen, FaArrowLeft } from 'react-icons/fa6';
import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Loading from '@/components/loading';
import AuthButton from '@/components/Buttons/auth';
import { FaWhatsapp } from 'react-icons/fa6';
import { MdOutlineDateRange } from 'react-icons/md';
import { AiOutlineGlobal } from 'react-icons/ai';

export default function ProfileInfoPage({ searchParams }: any) {
    const callbackUrl = searchParams.callbackUrl || '/chat';
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

    const [load, setLoad] = useState<boolean>(false);
    const HandleLogout = () => {
        setLoad(true);
        setTimeout(() => {
            signOut();
            setLoad(false);
        }, 2000);
    };
    return (
        <div className='w-full sm:max-w-md bg-zinc-900 sm:rounded-xl sm:shadow sm:shadow-xl sm:shadow-zinc-950 flex flex-col sm:border-2 sm:border-zinc-800 p-4'>
            <div className='w-full flex justify-between gap-2'>
                <Link
                    href={callbackUrl}
                    className='text-zinc-400 outline-0 bg-zinc-800/[0.75] rounded-lg p-2 hover:bg-zinc-800/[0.40] text-base sm:text-lg md:text-xl cursor-pointer'
                >
                    <FaArrowLeft />
                </Link>
                <Link
                    href={`/chat/profile/edit?callbackUrl=${callbackUrl}`}
                    className='text-zinc-400 outline-0 bg-zinc-800/[0.75] rounded-lg p-2 hover:bg-zinc-800/[0.40] text-base sm:text-lg md:text-xl cursor-pointer'
                >
                    <FaPen />
                </Link>
            </div>
            <div className='w-full flex flex-col items-center'>
                <div className='flex gap-2 items-center'>
                    {session?.user?.pp && session?.user?.pp === 'empety' ? (
                        <Avatar
                            name={session?.user?.name}
                            size='125'
                            round={true}
                        />
                    ) : (
                        <Image
                            src={session?.user?.pp}
                            alt='profile photo'
                            width={125}
                            height={125}
                            loading='lazy'
                            className='rounded-full border border-zinc-700'
                        />
                    )}
                    <div className='flex flex-col p-3 rounded-xl bg-zinc-950/[0.4]'>
                        <h1 className='text-2xl text-zinc-300 text-center font-semibold'>
                            {session?.user?.name ? (
                                session?.user?.name
                            ) : (
                                <div className='px-6 py-3 rounded bg-zinc-800'></div>
                            )}
                        </h1>
                        <p className='mt-3 text-sm text-zinc-500 font-normal flex gap-2 items-center'>
                            <FaWhatsapp />
                            {session?.user?.wa_number ? (
                                '+' + session?.user?.wa_number
                            ) : (
                                <div className='px-5 py-1 rounded bg-zinc-800'></div>
                            )}
                        </p>
                        <p className='text-sm text-zinc-500 font-normal flex gap-2 items-center'>
                            <MdOutlineDateRange />
                            {session?.user?.created_at ? (
                                getTimestamp(session?.user?.created_at)
                            ) : (
                                <div className='px-5 py-1 rounded bg-zinc-800'></div>
                            )}
                        </p>
                        <p className='mt-3 text-sm text-zinc-500 font-normal flex gap-2 items-center'>
                            <AiOutlineGlobal />
                            {session?.user?.user_id ? (
                                '+' + session?.user?.user_id
                            ) : (
                                <div className='px-5 py-1 rounded bg-zinc-800'></div>
                            )}
                        </p>
                    </div>
                </div>
                <AuthButton
                    onDisabling={load}
                    onClicking={HandleLogout}
                    type='button'
                    onLoading={load}
                    loadingText='Logging out...'
                >
                    Logout
                </AuthButton>
            </div>
        </div>
    );
}
