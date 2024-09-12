'use client';

import Image from 'next/image';
import LoadingMessage from '@/components/loading';
import { useDebounceValue } from 'usehooks-ts';
import { useEffect, ChangeEvent, useState } from 'react';
import { BsStars } from 'react-icons/bs';
import { requestChatCompletions } from '@/services/groqService';

export default function AiChats({ defaultValue = '' }) {
    const [debouncedValue, setValue] = useDebounceValue(defaultValue, 1500);
    const [result, setResult] = useState<string>('');

    useEffect(() => {
        async function requestToGroq() {
            let res: string = await requestChatCompletions(debouncedValue);
            setResult(res);
        }

        debouncedValue && requestToGroq();
    }, [debouncedValue]);

    const handleRequestToGroq = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
    };

    return (
        <main className='bg-zinc-950 w-full min-h-screen flex'>
            <section className='w-full flex flex-col h-screen bg-ornament bg-fixed bg-zinc-950 overflow-y-auto p-10'>
                <div className='w-full flex flex-col justify-center items-center flex-grow bg-zinc-950 max-w-xl'>
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
                    <form className='mt-3 w-full'>
                        <textarea
                            onChange={handleRequestToGroq}
                            placeholder='Ask something'
                            className='w-full bg-transparent text-base border-b-2 border-indigo-400 placeholder:text-zinc-500 placeholder:text-sm outline-0 h-16 resize-none text-indigo-300'
                        ></textarea>
                    </form>
                    {result && (
                        <div className='mt-4 w-full rounded-xl bg-slate-950 border-2 border-slate-900 p-5'>
                            <p className='text-base text-zinc-400 font-normal'>
                                {result}
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
