'use client';

import { useSession } from 'next-auth/react';
import type { DateGroup, SenderGroup, User } from '@/types';
import BublesGroup from './BublesGroup';

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
        <div className='w-full flex flex-col justify-end gap-3 px-6 pb-7 pt-16'>
            {listMessage.map((date: DateGroup, dateIndex: number) => (
                <div
                    className='scroll-mt-28'
                    key={dateIndex}
                    id={date.date.replaceAll(' ', '')}
                >
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
                                <BublesGroup
                                    key={messageIndex}
                                    profileName={profileName}
                                    profilePicture={profilePicture}
                                    message={message}
                                    isFromMe={isFromMe}
                                />
                            );
                        }
                    )}
                </div>
            ))}
        </div>
    );
}
