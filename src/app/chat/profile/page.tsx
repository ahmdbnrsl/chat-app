'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaPen, FaArrowLeft, FaWhatsapp } from 'react-icons/fa6';
import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Loading from '@/components/loading';
import AuthButton from '@/components/Buttons/auth';
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
            <div className='w-full flex flex-col items-center mb-2'>
                <div className='flex flex-col gap-3 items-center w-full'>
                    <div className='w-full rounded-xl overflow-hidden flex justify-center items-center bg-zinc-950/[0.2] bg-profile_banner bg-cover bg-center bg-no-repeat p-3 flex-col'>
                        <div className='w-full flex justify-between gap-2'>
                            <Link
                                href={callbackUrl}
                                className='text-zinc-300 outline-0 hover:bg-zinc-800/[0.75] rounded-lg p-2 bg-zinc-800/[0.40] text-base sm:text-lg md:text-xl cursor-pointer'
                            >
                                <FaArrowLeft />
                            </Link>
                            <Link
                                href={`/chat/profile/edit?callbackUrl=${callbackUrl}`}
                                className='text-zinc-300 outline-0 hover:bg-zinc-800/[0.75] rounded-lg p-2 bg-zinc-800/[0.40] text-base sm:text-lg md:text-xl cursor-pointer'
                            >
                                <FaPen />
                            </Link>
                        </div>
                        <Image
                            src={
                                session?.user?.pp &&
                                session?.user?.pp === 'empety'
                                    ? 'https://img.freepik.com/free-vector/mans-face-flat-style_90220-2877.jpg?t=st=1725583890~exp=1725587490~hmac=4e3f30256635b4d9975caef2b198dc3b0fd38137ab22244ec9c4f9da282e0be1&w=740'
                                    : session?.user?.pp
                            }
                            alt='profile photo'
                            width={140}
                            height={140}
                            loading='lazy'
                            className='rounded-full border border-zinc-700'
                        />
                    </div>
                    <div className='w-full flex flex-col p-3 rounded-xl bg-zinc-950/[0.2] items-start'>
                        <h1 className='w-full text-center pb-1 border-b-2 border-zinc-800 text-2xl text-zinc-300 text-center font-semibold'>
                            {session?.user?.name ? (
                                session?.user?.name
                            ) : (
                                <div className='px-10 py-3 rounded bg-zinc-800'></div>
                            )}
                        </h1>
                        <p className='mt-3 text-xs text-zinc-400 font-normal flex gap-2 items-center'>
                            <FaWhatsapp className='text-lg' />
                            {session?.user?.wa_number ? (
                                '+' + session?.user?.wa_number
                            ) : (
                                <div className='px-10 py-1 rounded bg-zinc-800'></div>
                            )}
                        </p>
                        <p className='mt-1 text-xs text-zinc-400 font-normal flex gap-2 items-center'>
                            <MdOutlineDateRange className='text-lg' />
                            {session?.user?.created_at ? (
                                getTimestamp(session?.user?.created_at)
                            ) : (
                                <div className='px-10 py-1 rounded bg-zinc-800'></div>
                            )}
                        </p>
                        <p className='mt-1 text-xs text-zinc-400 font-normal flex gap-2 items-center'>
                            <AiOutlineGlobal className='text-lg' />
                            {session?.user?.user_id ? (
                                session?.user?.user_id
                            ) : (
                                <div className='px-10 py-1 rounded bg-zinc-800'></div>
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
