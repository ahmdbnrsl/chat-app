'use client';
import { useState, MouseEvent } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { IoSearch } from 'react-icons/io5';
import Link from 'next/link';
import Avatar from 'react-avatar';
import Image from 'next/image';
import ModalForm from './ModalForm';

export default function Wrapper({ children }: { children: React.ReactNode }) {
    const { data: session, status }: { data: any; status: string } =
        useSession();
    const { push } = useRouter();
    const [showModal, setShowModal] = useState<boolean>(false);

    const showingModal = (): void => setShowModal(true);
    const hideModal = (): void => setShowModal(false);

    const Redirect = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const baseUrl: string =
            process.env.NEXT_PUBLIC_SELF_URL + '/chat' ||
            'https://vbchat.vercel.app/chat';
        const url = new URL('/profile', baseUrl);
        url.searchParams.set('callbackUrl', encodeURI(baseUrl));
        push(url);
    };

    return (
        <section className='bg-zinc-950 w-full flex flex-col min-h-screen xl:w-1/3 xl:border-r border-zinc-800 box-border relative'>
            <nav className='sticky top-0 z-20 bg-zinc-950 w-full py-4 px-6 flex flex-col border-b border-zinc-800 items-center'>
                <div className='flex justify-between w-full items-center'>
                    <h1 className='text-zinc-200 text-lg sm:text-xl font-semibold tracking-normal'>
                        Chats
                    </h1>
                    <button
                        onClick={Redirect}
                        className='text-zinc-300 font-medium text-lg sm:text-xl md:text-2xl outline-0 bg-transparent border-0 rounded-full flex py-1 pl-1 bg-zinc-900 hover:bg-zinc-800 pr-4 transition-colors gap-2 items-center cursor-pointer'
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
                        <div className='flex flex-col'>
                            <h1 className='text-base font-normal text-zinc-400'>
                                Profile
                            </h1>
                        </div>
                    </button>
                </div>
                <div className='w-full relative flex justify-start items-center'>
                    <div className='-mb-0.5 pl-3 absolute text-zinc-400 text-lg sm:text-xl'>
                        <IoSearch />
                    </div>
                    <input
                        type='text'
                        placeholder='Search by name'
                        className='mt-2 w-full py-2 pl-10 pr-4 text-zinc-300 font-normal text-base sm:text-lg rounded-full bg-zinc-900/[0.5] outline-0 border-2 border-zinc-800 focus:border-zinc-700 placeholder:text-zinc-400 placeholder:text-sm sm:placeholder:text-base'
                    />
                </div>
            </nav>
            {children}
            <div className='sticky bottom-0 bg-zinc-950 w-full py-4 px-6 flex flex-col items-center'>
                <button
                    onClick={showingModal}
                    type='button'
                    className='bg-zinc-200 rounded-full py-1.5 px-6 outline-0 text-zinc-950 text-center cursor-pointer hover:scale-[1.025] transition-transform'
                >
                    + Start Chat
                </button>
            </div>
            {showModal && (
                <div className='absolute z-[99999999] inset-0 flex justify-center items-center bg-zinc-950/[0.15] backdrop-blur p-4'>
                    <div
                        className='absolute inset-0'
                        onClick={hideModal}
                    ></div>
                    <ModalForm hide={hideModal} />
                </div>
            )}
        </section>
    );
}
