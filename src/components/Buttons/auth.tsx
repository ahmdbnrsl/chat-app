'use client';
import type { AuthButtonProps } from '@/types';
import Loading from '@/components/loading';

export default function AuthButton({
    children,
    onDisabling,
    type,
    onLoading,
    onClicking
}: AuthButtonProps) {
    return (
        <button
            disabled={onDisabling}
            type={type}
            onClick={onClicking || (e => e.preventDefault())}
            className={`${
                onDisabling || onLoading
                    ? 'bg-zinc-800 text-zinc-500'
                    : 'bg-gradient-to-br from-zinc-200 to-zinc-400 text-zinc-950'
            } flex gap-2 justify-center items-center py-2 mt-2 w-full cursor-pointer text-lg rounded-xl outline-0 font-medium`}
        >
            {onLoading ? (
                <>
                    <Loading /> {loadingText}
                </>
            ) : (
                children
            )}
        </button>
    );
}
