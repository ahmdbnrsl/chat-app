'use client';

import { useState, MouseEvent } from 'react';
import { useSession } from 'next-auth/react';
import { Message } from '@/types';
import { FetcherService as deleteMessage } from '@/services/fetcherService';
import CopyButton from '@/components/Buttons/copy';
import DeleteButton from '@/components/Buttons/delete';

export default function ListMessage({
    message,
    checkDate,
    timestamp,
    key,
    senderPp
}: {
    message: Message;
    checkDate: string | null;
    timestamp: string;
    key: string;
    senderPp?: string;
}) {
    const { data: session, status }: { data: any; status: string } =
        useSession();
    const [load, setLoad] = useState<boolean>(false);
    const HandleDelete = async (
        e: MouseEvent<HTMLButtonElement>,
        messageId: string
    ) => {
        e.preventDefault();
        setLoad(true);
        const deleted = await deleteMessage(
            { message_id: messageId },
            {
                path: 'delete_message',
                method: 'DELETE'
            }
        );
        if (deleted && deleted?.status) {
            setLoad(false);
        }
    };
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
                    className={`w-fit text-zinc-300 py-1 min-w-[10rem] px-3 flex flex-col rounded-b-2xl transition-colors ${
                        message.sender_id === session?.user?.user_id
                            ? 'bg-zinc-700/[0.5] rounded-tl-2xl group-hover:bg-zinc-800/[0.5]'
                            : 'bg-zinc-800/[0.5] rounded-tr-2xl group-hover:bg-zinc-700/[0.5]'
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
                    <div className='transition-all group-hover:flex flex-col hidden gap-3 px-5 rounded-lg mt-2.5 bg-zinc-800/[0.5] py-2'>
                        <DeleteButton
                            onClicking={HandleDelete}
                            messageId={message.message_id}
                            load={load}
                        />
                        <CopyButton copyText={message.message_text} />
                    </div>
                ) : (
                    <div className='transition-all group-hover:flex hidden gap-3 px-5 rounded-lg mt-2.5 bg-zinc-700/[0.5] py-2 text-lg'>
                        <CopyButton copyText={message.message_text} />
                    </div>
                )}
            </div>
            {checkDate && (
                <div className='w-full flex justify-center py-2'>
                    <div className='px-3 py-0.5 rounded bg-zinc-900 text-sm text-zinc-400 font-normal'>
                        {checkDate}
                    </div>
                </div>
            )}
        </>
    );
}
