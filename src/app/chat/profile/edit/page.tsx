'use client';
import Avatar from 'react-avatar';
import Image from 'next/image';
import Link from 'next/link';
import { FaPen, FaArrowLeft } from 'react-icons/fa6';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

export default function EditFormPage() {
    const { data: session, status }: { data: any; status: string } =
        useSession();
    const [nameValue, setNameValue] = useState<string | null | undefined>('');
    useEffect(() => {
        setNameValue(session?.user?.name);
    }, [session?.user?.name]);
    return (
        <div className='w-full max-w-md bg-zinc-900 rounded-xl shadow shadow-xl shadow-zinc-950 flex flex-col border-2 border-zinc-800'>
            <div className='w-full p-4 flex mt-2'>
                <Link
                    href='/chat/profile'
                    className='text-xl text-zinc-400'
                >
                    <FaArrowLeft />
                </Link>
            </div>
            <div className='w-full p-4 flex flex-col items-center mt-2'>
                <h1 className='flex items-end gap-2 text-2xl font-bold text-zinc-300 text-center'>
                    <FaPen /> Edit Profile
                </h1>
                <p className='mt-3 text-base font-normal text-center text-zinc-400'>
                    You can edit profile photo and your name
                </p>
            </div>
            <form className='p-4 w-full flex flex-col gap-4'>
                <div className='w-full flex flex-col items-start'>
                    <label
                        htmlFor='photo'
                        className='w-full relative flex justify-center items-center'
                    >
                        {session?.user?.pp && session?.user?.pp === 'empety' ? (
                            <>
                                <Avatar
                                    size='125'
                                    name={session?.user?.name}
                                    round={true}
                                />
                                <Image
                                    src='/icon_asset/00_1.png'
                                    alt='icon'
                                    width={125}
                                    height={125}
                                    loading='lazy'
                                    className='rounded-full border border-zinc-700 absolute z-[99999] opacity-50'
                                />
                            </>
                        ) : (
                            <>
                                <Image
                                    src={session?.user?.pp}
                                    alt={session?.user?.name}
                                    width={125}
                                    height={125}
                                    loading='lazy'
                                    className='rounded-full border border-zinc-700'
                                />
                                <Image
                                    src='/icon_asset/00_1.png'
                                    alt='icon'
                                    width={125}
                                    height={125}
                                    loading='lazy'
                                    className='rounded-full border border-zinc-700 absolute z-[99999] opacity-50'
                                />
                            </>
                        )}
                    </label>
                    <input
                        type='file'
                        accept='.jpg, .png, .jpeg'
                        className='hidden'
                        id='photo'
                    />
                </div>
            </form>
            <form className='p-4 w-full flex flex-col gap-4 mb-4'>
                <div className='w-full flex flex-col items-start'>
                    <input
                        value={nameValue}
                        type='text'
                        id='name'
                        name='name'
                        maxLength={25}
                        placeholder='...'
                        className='name peer w-full bg-zinc-900 outline-0 text-lg font-normal text-zinc-200 tracking-wider rounded-xl px-4 py-2 border-4 border-zinc-600 placeholder:text-transparent focus:border-zinc-400 cursor-text'
                    />
                    <label
                        htmlFor='name'
                        className='absolute -translate-y-3 peer-placeholder-shown:translate-y-3 ml-3 text-sm font-normal text-zinc-500 peer-focus:-translate-y-3 bg-zinc-900 w-auto px-2 py-1 peer-focus:text-zinc-300'
                    >
                        Edit your name here
                    </label>
                </div>

                <button
                    type='submit'
                    className='flex gap-2 justify-center items-center py-2 mt-2 w-full cursor-pointer bg-gradient-to-br from-zinc-200 to-zinc-400 text-zinc-950 text-lg rounded-xl outline-0 font-medium'
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
}
