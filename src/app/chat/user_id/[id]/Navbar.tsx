'use client';
import Image from 'next/image';
import Link from 'next/link';
import Avatar from 'react-avatar';
import { User } from '@/models/users';

export default function NavbarChat({
    senderInfo
}: {
    senderInfo: User | null | undefined;
}) {
    return (
        <nav className='sticky top-0 z-20 bg-zinc-950 w-full py-4 px-6 flex flex-col md:flex-row gap-3 border-b border-zinc-800 items-center'>
            <div className='flex justify-between w-full items-center'>
                <div className='flex items-center gap-3'>
                    <Link
                        href='/chat'
                        className='text-lg sm:text-xl md:text-2xl text-zinc-300 px-2 mr-3 cursor-pointer'
                    >
                        ⟨
                    </Link>
                    <button
                        className={`text-zinc-300 font-medium text-lg sm:text-xl md:text-2xl outline-0 ${
                            !senderInfo
                                ? 'bg-zinc-800 p-4'
                                : 'bg-transparent p-0'
                        } border-0 rounded-full hover:bg-zinc-800`}
                    >
                        {senderInfo ? (
                            senderInfo?.pp !== 'empety' ? (
                                <Image
                                    alt='User profile'
                                    src={senderInfo?.pp}
                                    height={35}
                                    width={35}
                                    className='rounded-full border border-zinc-700'
                                    loading='lazy'
                                />
                            ) : (
                                <Avatar
                                    name={senderInfo?.name}
                                    size='35'
                                    round={true}
                                />
                            )
                        ) : null}
                    </button>
                    <div className='flex flex-col'>
                        <h1 className='text-zinc-200 text-lg sm:text-xl font-semibold tracking-normal'>
                            {senderInfo ? (
                                senderInfo?.name
                            ) : (
                                <div className='px-9 py-2.5 rounded-lg bg-zinc-800'></div>
                            )}
                        </h1>
                        <p
                            className={`text-xs font-normal text-zinc-400 ${
                                !senderInfo ? 'mt-1.5' : ''
                            }`}
                        >
                            {senderInfo ? (
                                '+' + senderInfo?.wa_number
                            ) : (
                                <div className='px-7 py-1 rounded-lg bg-zinc-800'></div>
                            )}
                        </p>
                    </div>
                </div>
            </div>
            <input
                type='text'
                placeholder='Search message'
                className='w-full py-1 px-2.5 sm:py-2 sm:px-4 text-zinc-300 font-normal text-base sm:text-lg rounded-full bg-zinc-900/[0.5] outline-0 border-2 border-zinc-800 focus:border-zinc-700 placeholder:text-zinc-400 placeholder:text-sm sm:placeholder:text-base'
            />
        </nav>
    );
}
