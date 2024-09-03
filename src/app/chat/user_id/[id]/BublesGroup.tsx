'use client';

import Image from 'next/image';
import Avatar from 'react-avatar';
import BubleMessage from '@/components/Buble';
import type { SenderGroup, GroupedMessage } from '@/types';

export default function BublesGroup({
    key,
    profilePicture,
    isFromMe,
    profileName,
    message
}: {
    key: number;
    profilePicture: string;
    isFromMe: boolean;
    profileName: string;
    message: SenderGroup;
}) {
    return (
        <div
            key={key}
            className={`w-full flex flex-col md:flex-row py-2 gap-2.5 ${
                isFromMe &&
                'items-end md:flex-row-reverse md:justify-start md:items-start'
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
                className={`w-full md:w-fit flex flex-col gap-2 ${
                    isFromMe && 'items-end'
                }`}
            >
                <h1 className='text-zinc-300 font-medium text-base'>
                    {isFromMe ? 'You' : profileName}
                </h1>
                {message.messages.map(
                    (buble: GroupedMessage, bubleIndex: number) => (
                        <BubleMessage
                            profileName={profileName}
                            buble={buble}
                            key={bubleIndex}
                            isFromMe={isFromMe}
                        />
                    )
                )}
            </div>
            <div className='w-[35px] hidden md:flex'></div>
        </div>
    );
}
