'use client';

import Image from 'next/image';
import LoadingMessage from '@/components/loading';
import { BsStars } from 'react-icons/bs';

export default function AiChats() {
    return (
        <main className='bg-zinc-950 w-full min-h-screen flex'>
            <section className='w-full flex flex-col h-screen bg-ornament bg-fixed bg-zinc-950 overflow-y-auto p-6'>
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
                    <form className='mt-3 w-full max-w-xl'>
                        <textarea
                            placeholder='Ask something'
                            className='w-full bg-transparent text-base border-b-2 border-indigo-400 placeholder:text-zinc-500 placeholder:text-sm outline-0 h-16 resize-none text-indigo-300'
                        ></textarea>
                    </form>
                </div>
            </section>
        </main>
    );
}
