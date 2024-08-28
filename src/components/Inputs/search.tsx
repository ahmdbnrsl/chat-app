'use client';
import { ChangeEvent } from 'react';
import { IoSearch } from 'react-icons/io5';
export default function SearchInput({
    placeHolder,
    onChanging
}: {
    placeHolder: string;
    onChanging?: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
    return (
        <div className='w-full relative flex justify-start items-center'>
            <div className='-mb-0.5 pl-3 absolute text-zinc-400 text-lg sm:text-xl'>
                <IoSearch />
            </div>
            <input
                type='text'
                onChange={onChanging || (() => {})}
                placeholder={placeHolder}
                className='mt-2 w-full py-2 pl-10 pr-4 text-zinc-300 font-normal text-base sm:text-lg rounded-full bg-zinc-900/[0.5] outline-0 border-2 border-zinc-800 focus:border-zinc-700 placeholder:text-zinc-400 placeholder:text-sm sm:placeholder:text-base'
            />
        </div>
    );
}
