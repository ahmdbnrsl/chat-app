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
        <div
            className={`mt-2 ${
                isSearchMessage && 'md:mt-0'
            } w-full flex justify-center items-center bg-zinc-900 rounded-lg overflow-hidden`}
        >
            <div className='px-3 -mb-[0.2rem] text-zinc-500 text-xl sm:text-2xl'>
                <IoSearch />
            </div>
            <input
                type='text'
                onChange={onChanging || (() => {})}
                placeholder={placeHolder}
                className={`bg-transparent w-full p-2 px-3 text-zinc-300 font-normal text-base sm:text-lg placeholder:text-zinc-500 placeholder:text-sm sm:placeholder:text-base outline-0 ${
                    isSearchMessage ? 'border-x-2' : 'border-l-2'
                } border-zinc-800`}
            />
            {isSearchMessage && (
                <button className='px-3 bg-transparent outline-0 text-zinc-500 text-xl sm:text-2xl cursor-pointer'>
                    <MdOutlineDateRange />
                </button>
            )}
        </div>
    );
}
