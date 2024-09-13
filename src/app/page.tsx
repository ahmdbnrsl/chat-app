'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Home() {
    const { data: session } = useSession();
    return (
        <div
            onClick={() => console.log('Hello World!')}
            className='h-screen w-screen bg-zinc-950 p-6 flex justify-center items-center'
        >
            <h1 className='text-zinc-300 text-4xl font-bold font-serif'>
                VB CHAT
            </h1>
            <Link
                href={session?.user ? '/chat' : '/login'}
                className='w-fit rounded-full bg-zinc-400 text-base px-5 py-1 outline-0'
            >
                {session?.user ? 'Start Chat' : 'Login'}
            </Link>
        </div>
    );
}
