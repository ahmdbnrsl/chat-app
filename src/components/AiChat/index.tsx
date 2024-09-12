'use client';

import Image from 'next/image';
import Link from 'next/link';
import { BsStars } from 'react-icons/bs';

export default function AIChat() {
    return (
        <Link
            href='/chat/ai'
            className='w-full rounded-xl transition-colors bg-slate-900/[0.45] flex justify-center items-center p-3 cursor-pointer mb-2'
        >
            <div className='w-full flex gap-3 items-center justify-start'>
                <div className='w-[50px] h-[50px] relative flex items-end justify-end'>
                    <Image
                        alt='User profile'
                        src='https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-gemini-icon.png'
                        height={50}
                        width={50}
                        className='rounded-full'
                        loading='lazy'
                    />
                </div>
                <div className='flex flex-col'>
                    <h1 className='text-base sm:text-lg text-indigo-400 font-semibold flex items-center w-fit'>
                        VB AI <BsStars className='ml-2' />
                    </h1>
                    <div className='flex items-center gap-2'>
                        <p className='w-[15ch] sm:w-[25ch] md:w-[50ch] xl:w-[15ch] text-xs sm:text-sm text-zinc-400 truncate'>
                            this is response from ai
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
}
