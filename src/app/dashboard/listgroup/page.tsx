'use client';

import { getListGroup } from '@/services/sendWaMessage';
import { useState, useEffect, useCallback } from 'react';
import Loading from '@/components/loading';

export default function ListGroup() {
    const [listGc, setListGc] = useState<
        { id: string; name: string }[] | false
    >(false);
    const fetchingListGroup = useCallback(async () => {
        const result: { id: string; name: string }[] | false =
            await getListGroup();
        if (result) setListGc(result);
    }, []);
    useEffect(() => {
        fetchingListGroup();
    }, [fetchingListGroup]);
    return (
        <div className='mt-5 sections scroll-mt-14 relative mb-0 py-0'>
            <div className='content-box transition-all flex flex-wrap gap-2'>
                {!listGc ? (
                    <div className='w-full flex justify-center gap-1.5 items-center text-lg font-medium text-zinc-500'>
                        <Loading /> Loading list group...
                    </div>
                ) : listGc?.length > 0 ? (
                    listGc.map(
                        (item: { id: string; name: string }, index: number) => (
                            <div
                                key={index}
                                className='w-full sm:w-auto p-2 rounded bg-zinc-600/[0.15] flex flex-col gap-2'
                            >
                                <h1 className='tracking-widest font-semibold text-lg text-zinc-300'>
                                    {item?.name}
                                </h1>
                                <div
                                    onClick={(): void => {
                                        window.navigator.clipboard.writeText(
                                            item?.id
                                        );
                                    }}
                                    className='text-base text-zinc-400 tracking-widest w-full rounded bg-zinc-600/[0.20] p-1 hover:bg-zinc-600/[0.10] cursor-pointer'
                                >
                                    {item?.id}
                                </div>
                            </div>
                        )
                    )
                ) : (
                    <div className='w-full flex justify-center gap-1.5 items-center text-lg font-medium text-zinc-500'>
                        No group found
                    </div>
                )}
            </div>
        </div>
    );
}
