'use client';
import type { AuthInputProps } from '@/types';

export default function AuthInput({
    identifier,
    type,
    maxs,
    onChanging
}: AuthInputProps) {
    return (
        <input
            onChange={onChanging || (() => {})}
            type={type}
            id={identifier}
            name={identifier}
            maxLength={maxs}
            placeholder='...'
            className={`${identifier} ${
                identifier === 'otp' && 'text-center'
            } peer w-full bg-zinc-900 outline-0 text-lg font-normal text-zinc-200 tracking-wider rounded-xl px-4 py-2 border-4 border-zinc-600 placeholder:text-transparent focus:border-zinc-400 cursor-text`}
        />
    );
}
