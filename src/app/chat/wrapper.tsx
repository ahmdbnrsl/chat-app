'use client';

import { useSession } from 'next-auth/react';
import Avatar from 'react-avatar';
import Image from 'next/image';
export default function Wrapper({ children }: { children: React.ReactNode }) {
    const { data: session, status }: { data: any; status: string } =
        useSession();
    return (
        <section className='bg-zinc-950 w-full flex flex-col min-h-screen xl:w-1/3 xl:border-r border-zinc-800 box-border'>
            <nav className='sticky top-0 z-20 bg-zinc-950 w-full py-4 px-6 flex flex-col border-b border-zinc-800 items-center'>
                <div className='flex justify-between w-full items-center'>
                    <h1 className='text-zinc-200 text-lg sm:text-xl font-semibold tracking-normal'>
                        Chats
                    </h1>
                    <Link
                        href='/chat/profile'
                        className='text-zinc-300 font-medium text-lg sm:text-xl md:text-2xl outline-0 bg-transparent border-0 rounded-full'
                    >
                        {session?.user?.pp && session?.user?.pp !== 'empety' ? (
                            <Image
                                alt='User profile'
                                src={session?.user?.pp}
                                height={35}
                                width={35}
                                className='rounded-full border border-zinc-700'
                                loading='lazy'
                            />
                        ) : (
                            <Avatar
                                name={session?.user?.name}
                                size='35'
                                round={true}
                            />
                        )}
                    </Link>
                </div>
                <input
                    type='text'
                    placeholder='Search by name'
                    className='mt-2 w-full py-2 px-4 text-zinc-300 font-normal text-base sm:text-lg rounded-lg bg-zinc-900/[0.5] outline-0 border-2 border-zinc-800 focus:border-zinc-700 placeholder:text-zinc-400 placeholder:text-sm sm:placeholder:text-base'
                />
            </nav>
            {children}
            <div className='sticky bottom-0 bg-zinc-950 w-full py-4 px-6 flex flex-col items-center'>
                <button className='bg-zinc-200 rounded-full py-1.5 px-6 outline-0 text-zinc-950 text-center'>
                    + Start Chat
                </button>
            </div>
        </section>
    );
}
