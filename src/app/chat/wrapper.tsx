'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { ProfileAvatar, ProfileAvatar2 } from './avatar';
import Modal from './modal';
export default function Wrapper({ children }: { children: React.ReactNode }) {
    const [showModal, setShowModal] = useState<boolean>(false);
    const { data: session, status }: { data: any; status: string } =
        useSession();
    return (
        <main className='bg-zinc-900 w-full min-h-screen flex'>
            {showModal && (
                <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-zinc-500/[0.15] backdrop-blur p-4'>
                    <div
                        onClick={() => setShowModal(false)}
                        className='fixed flex justify-center items-center inset-0 z-51 overflow-x-hidden overflow-y-auto outline-none focus:outline-none'
                    ></div>
                    <Modal
                        name={session?.user?.name}
                        wa_number={session?.user?.wa_number}
                        created_at={session?.user?.created_at}
                        pp={session?.user?.pp}
                    />
                </div>
            )}
            <section className='w-full flex flex-col min-h-screen xl:w-1/3'>
                <nav className='sticky top-0 z-20 bg-zinc-900 w-full py-4 px-6 flex flex-col border-b border-zinc-800 items-center'>
                    <div className='flex justify-between w-full items-center'>
                        <h1 className='text-zinc-200 text-lg sm:text-xl font-semibold tracking-normal'>
                            Chats
                        </h1>
                        <button
                            onClick={() => setShowModal(true)}
                            className='text-zinc-300 font-medium text-lg sm:text-xl md:text-2xl outline-0 bg-transparent border-0 rounded-full'
                        >
                            <ProfileAvatar2 username={session?.user?.name} />
                        </button>
                    </div>
                    <input
                        type='text'
                        placeholder='Search by name'
                        className='mt-2 w-full py-2 px-4 text-zinc-300 font-normal text-base sm:text-lg rounded-lg bg-zinc-800/[0.5] outline-0 border-2 border-zinc-800 focus:border-zinc-700 placeholder:text-zinc-400 placeholder:text-sm sm:placeholder:text-base'
                    />
                </nav>
                {children}
                <div className='sticky bottom-0 bg-zinc-900 w-full py-4 px-6 flex flex-col border-t border-zinc-800 items-center'>
                    <button className='bg-zinc-200 rounded-full py-1.5 px-6 outline-0 text-zinc-950 text-center'>
                        + Start Chat
                    </button>
                </div>
            </section>
        </main>
    );
}
