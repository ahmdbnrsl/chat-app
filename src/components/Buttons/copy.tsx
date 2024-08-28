'use client';
import { useState, MouseEvent } from 'react';
import { IoCopyOutline } from 'react-icons/io5';
import { IoMdCheckmark } from 'react-icons/io';

export default function CopyButton({ copyText }: { copyText: string }) {
    const [copied, setCopied] = useState<boolean>(false);
    const HandleCopy = (e: MouseEvent<HTMLButtonElement>, text: string) => {
        e.preventDefault();
        setCopied(true);
        window.navigator.clipboard.writeText(text);
        setTimeout(() => setCopied(false), 1000);
    };
    return (
        <button
            onClick={e => HandleCopy(e, copyText)}
            className={`${
                copied ? 'text-green-500' : 'text-zinc-300'
            } outline-0 bg-transparent flex gap-1.5 text-base items-center`}
        >
            {!copied ? (
                <>
                    <IoCopyOutline className='text-lg' /> Copy
                </>
            ) : (
                <>
                    <IoMdCheckmark className='text-lg' /> Copied!
                </>
            )}
        </button>
    );
}
