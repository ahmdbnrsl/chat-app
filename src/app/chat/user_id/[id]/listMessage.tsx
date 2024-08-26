'use client';
import { useSession } from 'next-auth/react';
import { Message } from '@/models/messages';
import { MdDeleteOutline } from 'react-icons/md';
import { IoCopyOutline } from 'react-icons/io5';
import { deleteMessage } from '@/services/messages/messageService';

export default function ListMessage({
    message,
    checkDate,
    timestamp,
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
                className={`w-full flex group flex-col ${
                    message.sender_id === session?.user?.user_id
                        ? 'items-end'
                        : 'items-start'
                }`}
            >
                <div
                    className={`w-fit text-zinc-300 py-1 min-w-[10rem] px-3 flex flex-col ${
                        message.sender_id === session?.user?.user_id
                            ? 'bg-zinc-700/[0.5] rounded-b-xl rounded-tl-xl'
                            : 'bg-zinc-800/[0.5] rounded-b-xl rounded-tr-xl'
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
                {session?.user?.user_id === message.sender_id ? (
                    <div className='group-hover:flex hidden gap-3 px-5 rounded-lg mt-2.5 bg-zinc-700/[0.5] py-2 text-lg'>
                        <button className='outline-0 bg-transparent text-red-500'>
                            <MdDeleteOutline />
                        </button>
                        <button className='outline-0 bg-transparent text-zinc-300'>
                            <IoCopyOutline />
                        </button>
                    </div>
                ) : (
                    <div className='group-hover:flex hidden gap-3 px-5 rounded-lg mt-2.5 bg-zinc-800/[0.5] py-2 text-lg'>
                        <button className='outline-0 bg-transparent text-zinc-300'>
                            <IoCopyOutline />
                        </button>
                    </div>
                )}
            </div>
            {checkDate ? (
                <div className='w-full flex justify-center py-2'>
                    <div className='px-3 py-0.5 rounded bg-zinc-900 text-sm text-zinc-400 font-normal'>
                        {checkDate}
                    </div>
                </div>
            ) : null}
        </>
    );
}
