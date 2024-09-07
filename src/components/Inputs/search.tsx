'use client';

import { useRef } from 'react';
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
    const dateInputRef = useRef<HTMLInputElement>(null);

    const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        const date = new Date(e.target.value);
        const formattedDate = new Intl.DateTimeFormat('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        }).format(date);

        const id: string = formattedDate.replaceAll(' ', '');
        const el: HTMLDivElement | null = document.getElementById(id);
        el &&
            el.scrollIntoView({
                block: 'start',
                behavior: 'smooth'
            });
    };

    const handleShowPicker = () => {
        dateInputRef?.current?.click();
    };
    return (
        <div
            className={`mt-2 ${
                isSearchMessage && 'md:mt-0'
            } w-full flex justify-center items-center bg-zinc-900 rounded-lg overflow-hidden relative`}
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
                <>
                    <button
                        onClick={handleShowPicker}
                        className='px-3 bg-transparent outline-0 text-zinc-500 text-xl sm:text-2xl cursor-pointer hover:text-zinc-300 transition-colors'
                    >
                        <MdOutlineDateRange />
                    </button>
                    <input
                        ref={dateInputRef}
                        type='date'
                        id='date'
                        onChange={handleDateChange}
                        className='invisible absolute z-[-666] w-0 h-0 p-0'
                    />
                </>
            )}
        </div>
    );
}
