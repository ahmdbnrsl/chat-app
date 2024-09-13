'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Home() {
    const { data: session } = useSession();
    return (
        <div
            onClick={() => console.log('Hello World!')}
            className='h-screen w-screen bg-zinc-950 p-6 flex flex-col justify-center items-center gap-3'
        >
            <h1 className='text-zinc-300 text-4xl font-bold font-serif'>
                VB CHAT
            </h1>
            <Link
                href={session?.user ? '/chat' : '/login'}
                className='w-fit rounded-full bg-zinc-200 text-base px-5 w-full max-w-md py-1 outline-0 text-zinc-950'
            >
                {session?.user ? 'Start Chat' : 'Login'}
            </Link>
        </div>
    );
}
