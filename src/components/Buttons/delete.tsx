'use client';
import { MouseEvent } from 'react';
import Loading from '@/components/loading';
import { RiDeleteBin7Line } from 'react-icons/ri';

export default function DeleteButton({
    load,
    onClicking,
    messageId
}: {
    load: boolean;
    onClicking?: (e: MouseEvent<HTMLButtonElement>, messageId: string) => void;
    messageId: string;
}) {
    return (
        <button
            disabled={load}
            onClick={onClicking ? e => onClicking(e, messageId) : () => {}}
            className={`hover:opacity-60 outline-0 bg-transparent text-red-500 flex gap-1.5 text-base items-center ${
                load && 'text-zinc-500'
            }`}
        >
            {!load ? (
                <>
                    <RiDeleteBin7Line className='text-lg' /> Delete
                </>
            ) : (
                <>
                    <Loading /> Deleting...
                </>
            )}
        </button>
    );
}
