'use client';

import Image from 'next/image';
import LoadingMessage from '@/components/loading';
import CodeWithHighlight from '@/components/Highlight/code';
import CopyButton from '@/components/Buttons/copy';
import { useDebounceValue } from 'usehooks-ts';
import { useEffect, ChangeEvent, useState } from 'react';
import { BsStars } from 'react-icons/bs';
import { requestChatCompletions } from '@/services/groqService';

export default function AiChats() {
    const [debouncedValue, setValue] = useDebounceValue('', 1500);
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
        <main className='bg-zinc-950 w-full min-h-screen flex overflow-y-auto'>
            <section className='w-full flex flex-col h-screen overflow-y-auto bg-fixed py-10 justify-center items-center'>
                <div className='w-full flex flex-col items-center min-h-screen px-6 max-w-4xl'>
                    <Image
                        src='https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-gemini-icon.png'
                        width={100}
                        height={100}
                        alt='user profile'
                        loading='lazy'
                        className='rounded-full mt-6'
                    />
                    <h1 className='mt-2 flex items-center gap-2 sm:gap-3 text-lg sm:text-xl md:text-2xl text-indigo-400 font-bold text-center'>
                        VB AI <BsStars className='ml-2' />
                    </h1>
                    <div className='w-full text-base p-6 bg-zinc-900/[0.5] rounded-xl text-indigo-300'>
                        <p className='h-full'>
                            Welcome to VB AI, VB AI is NLP based by model of
                            llama3-70b-8192. Enter prompt below, the prompt will
                            auto generated every 1.5 second, Happy using, if an
                            error please try again.
                        </p>
                    </div>
                    <form className='mt-2 w-full'>
                        <textarea
                            onChange={handleRequestToGroq}
                            placeholder='Ask something'
                            className='py-4 px-6 w-full h-auto bg-transparent text-base bg-zinc-900/[0.5] border-2 border-zinc-900/[0.5] hover:border-zinc-900/[0.8] placeholder:text-zinc-500 outline-0 resize-none text-indigo-300 font-medium rounded-xl'
                        ></textarea>
                    </form>
                    {result && (
                        <div className='p-2 mt-4 rounded-2xl bg-transparent py-6 w-full flex flex-col gap-3'>
                            <div className='w-full flex justify-end'>
                                <CopyButton text={result} />
                            </div>
                            <div className='w-fit max-w-full my-2'>
                                <CodeWithHighlight>{result}</CodeWithHighlight>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
