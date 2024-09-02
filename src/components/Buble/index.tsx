'use client';

import type { GroupedMessage, MessageQuoted, ID } from '@/types';
import { hour } from '@/services/getTime';
import { useCallback, MouseEvent } from 'react';

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
    const truncateFiltration = (text: string): string => {
        return text.length > 200 ? text.slice(0, 200) + '...' : text;
    };
    const HandleScroll = (e: MouseEvent<HTMLDivElement>, id: string) => {
        e.preventDefault();
        const el: HTMLElement | null = document.getElementById(id);
        if (el !== null || el) {
            el.scrollIntoView({
                block: 'center',
                behavior: 'smooth'
            });
            el.style.transform = 'scale(1.02)';
            el.style.border = '1px solid #d4d4d8';
            setTimeout(() => {
                el.style.transform = 'scale(1)';
                el.style.border = 'none';
            }, 1500);
        }
    };
    return (
        <div
            onClick={onClicking}
            key={key}
            id={buble.message_id}
            className={`w-fit h-fit transition-transform ${
                isFromMe ? 'bg-slate-900' : 'bg-zinc-900'
            } rounded-lg p-1 text-base text-zinc-300 min-w-[5rem] flex flex-col max-w-full`}
        >
            {buble?.message_quoted && (
                <div
                    onClick={e =>
                        HandleScroll(e, buble?.message_quoted?.message_id as ID)
                    }
                    className={`overflow-hidden cursor-pointer w-full flex rounded-lg mb-2 ${
                        isFromMe ? 'bg-slate-950/[0.6]' : 'bg-zinc-950/[0.6]'
                    }`}
                >
                    <div className='w-[4px] flex items-stretch bg-slate-300 rounded-b-full rounded-t-full'></div>
                    <div className='p-2 flex flex-col gap-1'>
                        <p className='text-zinc-400 text-sm font-medium'>
                            {buble.message_quoted.from_name}
                        </p>
                        <p className='text-zinc-500 text-xs font-normal'>
                            {truncateFiltration(
                                buble?.message_quoted?.message_text as ID
                            )}
                        </p>
                    </div>
                </div>
            )}
            <div>
                <pre
                    className='mt-1 px-2 h-full whitespace-pre-wrap text-base font-inherit'
                    style={{ fontFamily: 'inherit' }}
                >
                    {buble.message_text}
                </pre>
            </div>
            <p className='px-2 mb-1 mt-1 w-full text-end text-xs font-normal text-zinc-500'>
                {timestamp(buble.message_timestamp)}
            </p>
        </div>
    );
}
