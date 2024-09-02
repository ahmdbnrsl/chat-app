'use client';

import type { GroupedMessage } from '@/types';
import { hour } from '@/services/getTime';
import { useCallback } from 'react';

export default function BubleMessage({
    onClicking,
    key,
    buble,
    isFromMe
}: {
    onClicking: () => void;
    key: number;
    buble: GroupedMessage;
    isFromMe: boolean;
}) {
    const timestamp = useCallback(hour, []);
    return (
        <div
            onClick={onClicking}
            key={key}
            className={`w-fit h-fit ${
                isFromMe ? 'bg-slate-900' : 'bg-zinc-900'
            } rounded-xl py-2 text-base px-3 text-zinc-300 min-w-[5rem]`}
        >
            <div>
                <pre
                    className='h-full whitespace-pre-wrap text-base font-inherit'
                    style={{ fontFamily: 'inherit' }}
                >
                    {buble.message_text}
                </pre>
            </div>
            <p className='mt-1 w-full text-end text-xs font-normal text-zinc-500'>
                {timestamp(buble.message_timestamp)}
            </p>
        </div>
    );
}
