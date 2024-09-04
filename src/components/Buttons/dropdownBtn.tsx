'use client';

import type { DropDownBtnProps } from '@/types';

export default function DropDownBtn({
    onClicking,
    children,
    isDisabled
}: DropDownBtnProps) {
    return (
        <button
            disabled={isDisabled ?? false}
            className={`flex gap-2 w-full text-left px-4 py-2 text-sm ${
                isDisabled !== undefined
                    ? 'text-red-700 hover:text-red-500'
                    : 'text-zinc-400 hover:text-zinc-300'
            } hover:bg-zinc-950/[0.4]`}
            role='menuitem'
            onClick={onClicking}
        >
            {children}
        </button>
    );
}
