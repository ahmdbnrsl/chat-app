'use client';

import { ChangeEvent } from 'react';
import { IoSearch } from 'react-icons/io5';
import { MdOutlineDateRange } from 'react-icons/md';

export default function SearchInput({
    placeHolder,
    onChanging,
    isSearchMessage
}: {
    placeHolder: string;
    onChanging?: (e: ChangeEvent<HTMLInputElement>) => void;
    isSearchMessage?: boolean;
}) {
    return (
        <div className='mt-2 md:mt-0 px-3 w-full flex justify-center items-center rounded-lg'>
            <div className='-mb-[0.2rem] text-zinc-500 text-xl sm:text-2xl'>
                <IoSearch />
            </div>
            <input
                type='text'
                onChange={onChanging || (() => {})}
                placeholder={placeHolder}
                className='bg-zinc-900/[0.5] focus:bg-zinc-900 w-full p-2 px-4 text-zinc-300 font-normal text-base sm:text-lg placeholder:text-zinc-500 placeholder:text-sm sm:placeholder:text-base outline-0'
            />
            {isSearchMessage && (
                <button className='bg-transparent outline-0 text-zinc-500 text-xl sm:text-2xl'>
                    <MdOutlineDateRange />
                </button>
            )}
        </div>
    );
}
