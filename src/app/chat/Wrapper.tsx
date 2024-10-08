'use client';

import { useState, MouseEvent, ChangeEvent } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { IoSearch } from 'react-icons/io5';
import { useManageSearchSender } from '@/lib/zustand';
import Link from 'next/link';
import Avatar from 'react-avatar';
import Image from 'next/image';
import ModalForm from './ModalForm';
import StartButton from '@/components/Buttons/start';
import SearchInput from '@/components/Inputs/search';

export default function Wrapper({ children }: { children: React.ReactNode }) {
    const { data: session, status }: { data: any; status: string } =
        useSession();
    const { push } = useRouter();
    const pathName = usePathname();
    const [showModal, setShowModal] = useState<boolean>(false);

    const showingModal = (): void => setShowModal(true);
    const hideModal = (): void => setShowModal(false);

    const { setSearchSenderValue, clearSearchSender } = useManageSearchSender();
    const handleSearchSender = (e: ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value;
        if (val.length > 0) setSearchSenderValue(val);
        if (val.length === 0) clearSearchSender();
    };

    const Redirect = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const baseUrl: string =
            process.env.NEXT_PUBLIC_SELF_URL || 'https://vbchat.vercel.app';
        const url = new URL('/chat/profile', baseUrl);
        url.searchParams.set('callbackUrl', encodeURI(baseUrl + pathName));
        push(String(url));
    };

    return (
        <section className='bg-zinc-950 w-full flex flex-col overflow-y-auto h-screen xl:w-1/3 xl:border-r border-zinc-800 box-border relative'>
            <nav className='sticky top-0 z-20 bg-zinc-950 w-full py-4 px-6 flex flex-col border-b border-zinc-800 items-center'>
                <div className='flex justify-between w-full items-center'>
                    <h1 className='text-zinc-200 text-lg sm:text-xl font-semibold tracking-normal'>
                        Chats
                    </h1>
                    <button
                        onClick={Redirect}
                        className='text-zinc-300 font-medium text-lg sm:text-xl md:text-2xl outline-0 bg-transparent border-0 rounded-full flex p-1 bg-zinc-900 hover:bg-zinc-800 transition-colors gap-2 items-center cursor-pointer'
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
                    </button>
                </div>
                <SearchInput
                    placeHolder='Search by name'
                    onChanging={handleSearchSender}
                />
            </nav>
            {children}
            <div className='sticky bottom-0 bg-zinc-950 w-full py-4 px-6 flex flex-col items-center'>
                <StartButton onClicking={showingModal}>
                    + Start chat
                </StartButton>
            </div>
            {showModal && (
                <div className='absolute z-[99999999] inset-0 flex justify-center items-center bg-zinc-950/[0.15] backdrop-blur p-5'>
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
