'use client';

import { MdContentCopy } from 'react-icons/md';
import { useOnClickOutside } from 'usehooks-ts';
import { FaCheck } from 'react-icons/fa6';
import { useRef, useState } from 'react';

export default function CopyButton({ text }: { text: string }) {
    const [isCopied, setIsCopied] = useState<boolean>(false);
    const checkRef = useRef<HTMLButtonElement>(null);

    useOnClickOutside(checkRef, () => setIsCopied(false));

    return (
        <>
            {isCopied ? (
                <button
                    ref={checkRef}
                    className='px-3 py-1 text-lg bg-zinc-900 rounded outline-0 text-zinc-300'
                >
                    <FaCheck />
                </button>
            ) : (
                <button
                    onClick={() => window.navigator.clipboard.writeText(text)}
                    className='px-3 py-1 text-lg bg-zinc-900 rounded outline-0 text-zinc-300'
                >
                    <MdContentCopy />
                </button>
            )}
        </>
    );
}
