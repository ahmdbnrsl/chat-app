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
                    className='px-3 py-1 text-lg hover:bg-zinc-900 transition-colors rounded outline-0 text-zinc-300 cursor-pointer'
                >
                    <FaCheck />
                </button>
            ) : (
                <button
                    onClick={() => {
                        window.navigator.clipboard.writeText(text);
                        setIsCopied(true);
                    }}
                    className='cursor-pointer px-3 py-1 text-lg hover:bg-zinc-900 transition-colors rounded outline-0 text-zinc-300'
                >
                    <MdContentCopy />
                </button>
            )}
        </>
    );
}
