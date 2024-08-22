'use client';
import Avatar from 'react-avatar';
import Image from 'next/image';
import Link from 'next/link';
import { FaPen } from 'react-icons/fa6';
import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Loading from '@/components/loading';

export default function ProfileInfoPage() {
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
        <div className='w-full max-w-md rounded-xl bg-zinc-900 p-7 flex  justify-end relative'>
            <Link
                href='/chat/profile/edit'
                className='text-zinc-400 outline-0 bg-zinc-800/[0.75] rounded-lg p-2 hover:bg-zinc-800/[0.40] absolute text-base sm:text-lg md:text-xl'
            >
                <FaPen />
            </Link>
            <div className='w-full flex flex-col items-center'>
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
                <h1 className='mt-3 text-xl sm:text-2xl md:text-3xl text-zinc-300 text-center font-bold'>
                    {session?.user?.name ? (
                        session?.user?.name
                    ) : (
                        <div className='px-6 py-3 rounded bg-zinc-800'></div>
                    )}
                </h1>
                <p className='text-xs sm:text-sm md:text-base text-zinc-400 font-normal'>
                    {session?.user?.wa_number ? (
                        '+' + session?.user?.wa_number
                    ) : (
                        <div className='px-5 py-1 rounded bg-zinc-800'></div>
                    )}
                </p>
                <p className='text-xs sm:text-sm text-zinc-500 font-normal'>
                    Created at :{' '}
                    {session?.user?.created_at ? (
                        getTimestamp(session?.user?.created_at)
                    ) : (
                        <div className='px-5 py-1 rounded bg-zinc-800'></div>
                    )}
                </p>
                <button
                    onClick={HandleLogout}
                    disabled={load ? true : false}
                    type='submit'
                    className={`mt-3 flex gap-2 justify-center items-center py-2 mt-2 w-full cursor-pointer ${
                        load
                            ? 'bg-zinc-800 text-zinc-500'
                            : 'bg-gradient-to-br from-zinc-200 to-zinc-400 text-zinc-950'
                    } text-lg rounded-xl outline-0 font-medium`}
                >
                    {load ? (
                        <>
                            <Loading /> {'Logging out...'}
                        </>
                    ) : (
                        'Logout'
                    )}
                </button>
            </div>
        </div>
    );
}
