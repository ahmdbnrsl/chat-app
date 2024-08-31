'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Avatar from 'react-avatar';
import type { DateGroup, SenderGroup, GroupedMessage, User } from '@/types';

export default function ListMessages({
    listMessage,
    senderInfo
}: {
    listMessage: Array<DateGroup>;
    senderInfo: User;
}) {
    const { data: session, status }: { data: any; status: string } =
        useSession();
    const { user_id, pp, name: userName } = session.user;
    return (
        <div className='w-full flex flex-col justify-end gap-3 px-6 pb-7 pt-16 flex-grow max-h-screen overflow-y-scroll'>
            {listMessage.map((date: DateGroup, dateIndex: number) => (
                <div key={dateIndex}>
                    <div className='w-full flex justify-center py-4'>
                        <div className='px-4 py-1 bg-zinc-900/[0.5] rounded-lg text-sm text-zinc-400'>
                            {date.date}
                        </div>
                    </div>
                    {date.messages.map(
                        (message: SenderGroup, messageIndex: number) => {
                            const isFromMe =
                                message.sender_id === session?.user?.user_id;
                            const profilePicture = isFromMe
                                ? pp
                                : senderInfo.pp;
                            const profileName = isFromMe
                                ? userName
                                : senderInfo.name;

                            return (
                                <div
                                    key={messageIndex}
                                    className={`w-full flex py-2 gap-2.5 ${
                                        isFromMe &&
                                        'flex-row-reverse justify-start'
                                    }`}
                                >
                                    <div className='w-fit h-fit rounded-full bg-zinc-900/[0.5]'>
                                        {profilePicture !== 'empety' ? (
                                            <Image
                                                alt='User profile'
                                                src={profilePicture}
                                                height={35}
                                                width={35}
                                                className='rounded-full border border-zinc-700'
                                                loading='lazy'
                                            />
                                        ) : (
                                            <Avatar
                                                name={profileName}
                                                size='35'
                                                round={true}
                                            />
                                        )}
                                    </div>
                                    <div
                                        className={`flex flex-col gap-2 ${
                                            isFromMe && 'items-end'
                                        }`}
                                    >
                                        <h1 className='text-zinc-300 font-medium text-base'>
                                            {isFromMe ? 'You' : profileName}
                                        </h1>
                                        {message.messages.map(
                                            (
                                                buble: GroupedMessage,
                                                bubleIndex: number
                                            ) => (
                                                <div
                                                    key={bubleIndex}
                                                    className='w-fit h-fit bg-zinc-900 rounded-xl py-2 text-base px-3 text-zinc-300 min-w-[5rem]'
                                                >
                                                    {buble.message_text}
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            );
                        }
                    )}
                </div>
            ))}
        </div>
    );
}
