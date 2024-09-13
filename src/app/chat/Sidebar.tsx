'use client';

import Loading from '@/components/loading';
import Avatar from 'react-avatar';
import Link from 'next/link';
import Image from 'next/image';
import AIChat from '@/components/AiChat';
import { usePathname, useRouter } from 'next/navigation';
import type { M, SenderMessage, ID } from '@/types';
import { date, hour } from '@/services/getTime';
import { useCallback, MouseEvent } from 'react';
import { BiCheckDouble } from 'react-icons/bi';
import { useManageSearchSender } from '@/lib/zustand';
import { getHighlightedText } from '@/components/Highlight/text';
import { useUpdatedSenderNewMessage } from '@/lib/zustand';

export default function SidebarChat() {
    const { searchSenderValue } = useManageSearchSender();
    const getDate = useCallback(date, []);
    const getHour = useCallback(hour, []);
    const pathName: string = usePathname();
    const IdSender: string = pathName.split('/').slice(-1)[0];
    const { push } = useRouter();
    const { listSender } = useUpdatedSenderNewMessage();

    return (
        <div className='w-full flex flex-col gap-3 p-6 flex-grow'>
            <AIChat />
            {!listSender ? (
                <div className='w-full flex justify-center gap-1.5 items-center text-lg font-medium text-zinc-500'>
                    <Loading /> Loading your chats...
                </div>
            ) : listSender?.length !== 0 ? (
                listSender?.map((sender: SenderMessage, index: number) => (
                    <Link
                        onClick={() => {
                            setTimeout(
                                () => push(`/chat/user_id/${sender?.id_user}`),
                                2000
                            );
                        }}
                        href={`/chat/user_id/${sender?.id_user}`}
                        key={index}
                        className={`w-full rounded-xl transition-colors hover:bg-zinc-900/[0.85] flex justify-between items-center p-3 cursor-pointer ${
                            IdSender === sender?.id_user && 'bg-zinc-900/[0.85]'
                        }`}
                    >
                        <div className='w-8/12 flex gap-3 items-center'>
                            <div className='w-[50px] h-[50px] relative flex items-end justify-end'>
                                {sender?.pp && sender?.pp !== 'empety' ? (
                                    <Image
                                        alt='User profile'
                                        src={sender?.pp}
                                        height={50}
                                        width={50}
                                        className='rounded-full border border-zinc-700'
                                        loading='lazy'
                                    />
                                ) : (
                                    <Avatar
                                        name={sender?.name}
                                        size='50'
                                        round={true}
                                    />
                                )}
                                {sender?.unReadedMessageLength > 0 && (
                                    <div className='text-xs text-zinc-950 py-[0.24rem] px-[0.5rem] flex items-center justify-center w-fit absolute bg-zinc-300 rounded-full border-4 border-zinc-950'>
                                        {sender?.unReadedMessageLength}
                                    </div>
                                )}
                            </div>
                            <div className='flex flex-col'>
                                <h1 className='text-base sm:text-lg text-zinc-300 font-normal'>
                                    {getHighlightedText(
                                        sender?.name as ID,
                                        searchSenderValue as ID
                                    )}
                                </h1>
                                <div className='flex items-center gap-2'>
                                    {sender?.fromMe && (
                                        <BiCheckDouble
                                            className={`text-base ${
                                                sender?.is_readed
                                                    ? 'text-sky-400'
                                                    : 'text-zinc-400'
                                            }`}
                                        />
                                    )}
                                    <p className='w-[15ch] sm:w-[25ch] md:w-[50ch] xl:w-[15ch] text-xs sm:text-sm text-zinc-400 truncate'>
                                        {sender?.latestMessageText}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='w-1/4 flex flex-col justify-center items-end'>
                            <p
                                className={`text-sm font-medium ${
                                    sender?.status === 'online'
                                        ? 'text-sky-400'
                                        : 'text-zinc-500'
                                }`}
                            >
                                {sender?.status}
                            </p>
                            <p className='text-xs font-normal text-zinc-500'>
                                {getDate(sender?.latestMessageTimestamp) ===
                                getDate(Date.now().toString())
                                    ? getHour(sender?.latestMessageTimestamp)
                                    : getDate(sender?.latestMessageTimestamp)}
                            </p>
                        </div>
                    </Link>
                ))
            ) : (
                <div className='w-full flex justify-center gap-1.5 items-center text-lg font-medium text-zinc-500'>
                    No chat found
                </div>
            )}
        </div>
    );
}
