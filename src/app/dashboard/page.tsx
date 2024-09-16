'use client';

import { FetcherService as getAllUser } from '@/services/fetcherService';
import { useState, useEffect, useCallback } from 'react';
import { date, hour } from '@/services/getTime';
import Image from 'next/image';
import Avatar from 'react-avatar';
import Loading from '@/components/loading';
import { type User } from '@/types';

export default function Users() {
    const [listUser, setListUser] = useState<User[] | null>(null);

    const fetchAllUser = useCallback(async () => {
        const users = await getAllUser(
            {},
            { path: 'get_all_user', method: 'POST' }
        );
        if (users && users?.status) setListUser(users?.result as User[]);
    }, [getAllUser]);
    const getDate = useCallback(date, []);
    const getHour = useCallback(hour, []);
    useEffect(() => {
        fetchAllUser();
    }, [fetchAllUser]);
    return (
        <div className='mt-5 sections scroll-mt-14 relative mb-0 py-0'>
            <div className='content-box transition-all w-full flex flex-col gap-3'>
                {!listUser ? (
                    <div className='w-full flex justify-center gap-1.5 items-center text-lg font-medium text-zinc-500'>
                        <Loading /> Loading Users...
                    </div>
                ) : listUser?.length > 0 ? (
                    listUser.map((user: User, index: number) => (
                        <div
                            key={index}
                            className='w-full rounded-xl transition-colors hover:bg-zinc-900/[0.85] flex justify-between items-center p-3'
                        >
                            <div className='w-8/12 flex gap-3 items-center'>
                                <div className='w-[50px] h-[50px] relative flex items-end justify-end'>
                                    {user?.pp && user?.pp !== 'empety' ? (
                                        <Image
                                            alt='User profile'
                                            src={user?.pp}
                                            height={50}
                                            width={50}
                                            className='rounded-full border border-zinc-700'
                                            loading='lazy'
                                        />
                                    ) : (
                                        <Avatar
                                            name={user?.name}
                                            size='50'
                                            round={true}
                                        />
                                    )}
                                    {user?.status &&
                                        user?.status === 'online' && (
                                            <div className='w-6 h-6 absolute bg-sky-400 rounded-full border-4 border-zinc-950'></div>
                                        )}
                                </div>
                                <div className='flex flex-col'>
                                    <h1 className='text-base sm:text-lg text-zinc-300 font-normal'>
                                        {user?.name}
                                    </h1>
                                    <div className='flex items-center gap-2'>
                                        <p className='w-[15ch] sm:w-[25ch] md:w-[50ch] xl:w-[15ch] text-xs sm:text-sm text-zinc-400 truncate'>
                                            +{user?.wa_number}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className='w-1/4 flex flex-col justify-center items-end'>
                                <p className='text-xs font-normal text-zinc-400'>
                                    Created at :
                                </p>
                                <p className='text-xs font-normal text-zinc-400'>
                                    {getDate(user.created_at) +
                                        ' ' +
                                        getHour(user.created_at)}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className='w-full flex justify-center gap-1.5 items-center text-lg font-medium text-zinc-500'>
                        No users found
                    </div>
                )}
            </div>
        </div>
    );
}
