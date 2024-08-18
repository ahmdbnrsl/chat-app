'use client';
import { useSession } from 'next-auth/react';
import { Message } from '@/models/messages';

export default function ListMessage({
    message,
    checkDate,
    getTimestamp,
    key
}: {
    message: Message;
    checkDate: string | null;
    timestamp: string;
    key: string;
}) {
    const { data: session, status }: { data: any; status: string } =
        useSession();
    return (
        <>
            <div
                key={key}
                className={`w-full flex ${
                    message.sender_id === session?.user?.user_id
                        ? 'justify-end'
                        : 'justify-start'
                }`}
            >
                <div
                    className={`w-fit text-zinc-300 py-1 min-w-[10rem] px-5 flex flex-col ${
                        message.sender_id === session?.user?.user_id
                            ? 'bg-zinc-700/[0.5] rounded-b-lg rounded-tl-lg'
                            : 'bg-zinc-800/[0.5] rounded-b-lg rounded-tr-lg'
                    }`}
                >
                    <pre
                        className='whitespace-pre-wrap text-base font-inherit'
                        style={{ fontFamily: 'inherit' }}
                    >
                        {message.message_text}
                    </pre>
                    <p className='mt-1 w-full text-end text-xs font-normal text-zinc-400'>
                        {timestamp}
                    </p>
                </div>
            </div>
            {checkDate ? (
                <div className='w-full flex justify-center py-2'>
                    <div className='px-3 py-0.5 rounded bg-zinc-900 text-base text-zinc-300 font-medium'>
                        {checkDate}
                    </div>
                </div>
            ) : null}
        </>
    );
}
