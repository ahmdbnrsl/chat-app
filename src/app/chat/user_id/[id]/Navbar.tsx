'use client';
import Image from 'next/image';
import Link from 'next/link';
import Avatar from 'react-avatar';
import SearchInput from '@/components/Inputs/search';
import type { User } from '@/types';
import { useManageSearchMessage } from '@/lib/zustand';
import { ChangeEvent } from 'react';

export default function NavbarChat({
    senderInfo
}: {
    senderInfo: User | null | undefined;
}) {
    const { setSearchMessValue, reset } = useManageSearchMessage();
    const handleSearchMessage = (e: ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value;
        if (val.length > 0) setSearchMessValue(val);
        if (val.length === 0) reset();
    };
    return (
        <nav className='sticky top-0 z-20 bg-zinc-950 w-full py-4 px-6 flex flex-col md:flex-row gap-3 border-b border-zinc-800 items-center'>
            <div className='flex items-center w-full gap-3 justify-start'>
                <Link
                    href='/chat'
                    className='text-lg sm:text-xl md:text-2xl text-zinc-500 px-2 mr-3 cursor-pointer'
                >
                    ⟨
                </Link>
                <div className='flex gap-3 items-center'>
                    <button
                        className={`text-zinc-300 font-medium text-lg sm:text-xl md:text-2xl outline-0 ${
                            !senderInfo
                                ? 'bg-zinc-800 p-4'
                                : 'bg-transparent p-0'
                        } border-0 rounded-full hover:bg-zinc-800`}
                    >
                        {senderInfo ? (
                            senderInfo?.pp !== 'empety' ? (
                                <Image
                                    alt='User profile'
                                    src={senderInfo?.pp}
                                    height={35}
                                    width={35}
                                    className='rounded-full border border-zinc-700'
                                    loading='lazy'
                                />
                            ) : (
                                <Avatar
                                    name={senderInfo?.name}
                                    size='35'
                                    round={true}
                                />
                            )
                        ) : null}
                    </button>
                    <div className='flex flex-col justify-center'>
                        <h1 className='text-zinc-200 text-lg sm:text-xl font-medium tracking-normal'>
                            {senderInfo ? (
                                senderInfo?.name
                            ) : (
                                <div className='px-9 py-2.5 rounded-lg bg-zinc-800'></div>
                            )}
                        </h1>
                        <p
                            className={`${
                                senderInfo?.status === 'online'
                                    ? 'text-sky-400'
                                    : 'text-zinc-400'
                            } text-sm font-medium tracking-normal`}
                        >
                            {senderInfo ? (
                                senderInfo?.status
                            ) : (
                                <div className='px-9 py-1 rounded-lg bg-zinc-800'></div>
                            )}
                        </p>
                    </div>
                </div>
            </div>
            <SearchInput
                onChanging={handleSearchMessage}
                placeHolder='Search message'
                isSearchMessage={true}
            />
        </nav>
    );
}
