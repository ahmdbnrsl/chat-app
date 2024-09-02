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
                isFromMe ? 'bg-zinc-700' : 'bg-zinc-900'
            } rounded-xl py-2 text-base px-3 text-zinc-300 min-w-[5rem] flex flex-col max-w-full`}
        >
            {buble?.message_quoted && (
                <div className='w-full px-[0.015rem] pt-[0.015rem] pb-2.5'>
                    <div
                        onClick={e =>
                            HandleScroll(
                                e,
                                buble?.message_quoted?.message_id as ID
                            )
                        }
                        className={`w-full p-2 flex flex-col gap-1 rounded-xl ${
                            isFromMe ? 'bg-zinc-900' : 'bg-zinc-700'
                        }`}
                    >
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
