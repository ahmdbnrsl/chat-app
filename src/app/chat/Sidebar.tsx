'use client';
import Loading from '@/components/loading';
import Avatar from 'react-avatar';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import type { M, SenderMessage } from '@/types';
import { getDate, getHour } from '@/services/getTime';

export default function SidebarChat({
    listSender
}: {
    listSender: Array<SenderMessage> | null | undefined;
}) {
    const pathName: string = usePathname();
    const IdSender: string = pathName.split('/').slice(-1)[0];
    return (
        <div className='w-full flex flex-col gap-3 p-6 flex-grow overflow-y-auto max-h-screen'>
            {!listSender ? (
                <div className='w-full flex justify-center gap-1.5 items-center text-lg font-medium text-zinc-500'>
                    <Loading /> Loading your chats...
                </div>
            ) : listSender?.length !== 0 ? (
                listSender?.map((sender: SenderMessage, index: number) => (
                    <Link
                        href={`/chat/user_id/${sender?.id_user}`}
                        key={index}
                        className={`w-full rounded-xl transition-colors hover:bg-zinc-900/[0.85] flex justify-between items-center p-3 cursor-pointer ${
                            IdSender === sender?.id_user && 'bg-zinc-900/[0.85]'
                        }`}
                    >
                        <div className='w-8/12 flex gap-3 items-center'>
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
                            <div className='flex flex-col'>
                                <h1 className='text-base sm:text-lg text-zinc-300 font-normal'>
                                    {sender?.name}
                                </h1>
                                <p className='w-[15ch] sm:w-[25ch] md:w-[50ch] xl:w-[15ch] text-xs sm:text-sm text-zinc-400 truncate'>
                                    {sender?.fromMe ? 'You : ' : ''}
                                    {sender?.latestMessageText}
                                </p>
                            </div>
                        </div>
                        <div className='w-1/4 flex flex-col justify-center items-end'>
                            <p className='text-xs sm:text-sm font-normal text-zinc-400'>
                                +{sender?.wa_number}
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
