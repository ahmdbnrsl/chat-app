'use client';

import Image from 'next/image';
import LoadingMessage from '@/components/loading';
import StartButton from '@/components/Buttons/start';
import { BsStars } from 'react-icons/bs';

export default function AiChats() {
    const listMessage: string[] = [];
    return (
        <main className='bg-zinc-950 w-full min-h-screen flex'>
            {!listMessage ? (
                <section className='w-full flex flex-col h-screen bg-fixed bg-zinc-950 justify-center items-center'>
                    <h1 className='flex items-center gap-2 sm:gap-3 text-lg sm:text-xl md:text-2xl text-zinc-400 font-medium text-center scale-[3]'>
                        <LoadingMessage />
                    </h1>
                </section>
            ) : (
                <section className='w-full flex flex-col h-screen bg-ornament bg-fixed bg-zinc-950 overflow-y-auto'>
                    {listMessage.length !== 0 ? (
                        <div className='w-full flex flex-col flex-grow justify-end'></div>
                    ) : (
                        <div className='w-full flex flex-col justify-center items-center p-6 flex-grow bg-zinc-950'>
                            <Image
                                src='https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-gemini-icon.png'
                                width={100}
                                height={100}
                                alt='user profile'
                                loading='lazy'
                                className='rounded-full'
                            />
                            <h1 className='mt-2 flex items-center gap-2 sm:gap-3 text-lg sm:text-xl md:text-2xl text-indigo-400 font-bold text-center'>
                                VB AI <BsStars className='ml-2' />
                            </h1>
                            <StartButton>Start Chatting</StartButton>
                        </div>
                    )}
                </section>
            )}
        </main>
    );
}
