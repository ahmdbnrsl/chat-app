'use client';
import type { AuthButtonProps } from '@/types';
import Loading from '@/components/loading';

export default function AuthButton({
    children,
    onDisabling,
    type,
    onLoading,
    loadingText,
    onClicking,
    isVerify
}: AuthButtonProps) {
    return (
        <button
            disabled={onDisabling}
            type={type}
            onClick={onClicking || (() => {})}
            className={`${
                onDisabling || onLoading
                    ? 'bg-zinc-800 text-zinc-500'
                    : 'bg-gradient-to-br from-zinc-200 to-zinc-400 text-zinc-950'
            } flex gap-2 justify-center items-center py-2 mt-2 w-full cursor-pointer text-lg rounded-xl outline-0 font-medium ${
                isVerify ? 'sm:mt-0' : ''
            }`}
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
