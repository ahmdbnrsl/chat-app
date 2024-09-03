'use client';

import type { ID, BubleProps } from '@/types';
import { hour } from '@/services/getTime';
import {
    useState,
    useRef,
    useEffect,
    useCallback,
    MouseEvent,
    TouchEvent
} from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import Dropdown from '@/components/Menu/dropDown';

export default function BubleMessage({
    profileName,
    key,
    buble,
    isFromMe
}: BubleProps) {
    const timestamp = useCallback(hour, []);
    const truncateFiltration = (text: string): string => {
        return text.length > 200 ? text.slice(0, 200) + '...' : text;
    };

    const [isPressed, setIsPressed] = useState<boolean>(false);
    const [pressTimeout, setPressTimeout] = useState<NodeJS.Timeout | null>(
        null
    );
    const [opacity, setOpacity] = useState<string>('opacity-100');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [positionTop, setPositionTop] = useState<string>('0');

    const bubleRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(menuRef, () => setIsOpen(false));

    const calculatePosition = useCallback(() => {
        if (bubleRef.current && menuRef.current) {
            const spaceRemaining =
                window.innerHeight -
                bubleRef.current.getBoundingClientRect().bottom;
            const contentHeight = menuRef.current.clientHeight;

            const topPosition =
                spaceRemaining > contentHeight
                    ? null
                    : -(contentHeight - spaceRemaining);

            setPositionTop(String(topPosition));
            const xPosition: 'left' | 'right' = isFromMe ? 'right' : 'left';
            menuRef.current.style[xPosition] = '0';
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            calculatePosition();
        }
    }, [isOpen, calculatePosition]);

    const HandleScroll = (e: MouseEvent<HTMLDivElement>, id: string) => {
        e.preventDefault();
        const el: HTMLElement | null = document.getElementById(id);
        if (el !== null || el) {
            el.scrollIntoView({
                block: 'center',
                behavior: 'smooth'
            });
            el.style.transform = 'scale(1.01)';
            el.style.border = '0.5px solid #52525b';
            setTimeout(() => {
                el.style.transform = 'scale(1)';
                el.style.border = 'none';
            }, 1500);
        }
    };

    const handleLongPress = useCallback((): void => {
        setIsOpen(true);
        setOpacity('opacity-50');
    }, []);

    const handleMouseDown = (event: MouseEvent<HTMLDivElement>): void => {
        setIsPressed(true);
        const timeout = setTimeout(handleLongPress, 500);
        setPressTimeout(timeout);
    };

    const handleMouseUp = (event: MouseEvent<HTMLDivElement>): void => {
        setIsPressed(false);
        if (pressTimeout) {
            clearTimeout(pressTimeout);
            setPressTimeout(null);
            setOpacity('opacity-100');
        }
    };

    const handleMouseLeave = (event: MouseEvent<HTMLDivElement>): void => {
        setIsPressed(false);
        if (pressTimeout) {
            clearTimeout(pressTimeout);
            setPressTimeout(null);
            setOpacity('opacity-100');
        }
    };

    const handleTouchStart = (event: TouchEvent<HTMLDivElement>): void => {
        setIsPressed(true);
        const timeout = setTimeout(handleLongPress, 500);
        setPressTimeout(timeout);
    };

    const handleTouchEnd = (event: TouchEvent<HTMLDivElement>): void => {
        setIsPressed(false);
        if (pressTimeout) {
            clearTimeout(pressTimeout);
            setPressTimeout(null);
            setOpacity('opacity-100');
        }
    };

    return (
        <div
            className='min-w-[5rem] relative w-fit h-fit max-w-full'
            key={key}
            id={buble.message_id}
        >
            <Dropdown
                ref={menuRef}
                isOpen={isOpen}
                positionTop={positionTop}
                buble={buble}
                profileName={profileName}
            />
            <div
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                ref={bubleRef}
                className={`${opacity} w-fit h-fit transition-transform ${
                    isFromMe ? 'bg-slate-900' : 'bg-zinc-900'
                } rounded-lg p-1 text-base text-zinc-300 flex flex-col max-w-full`}
            >
                {buble?.message_quoted && (
                    <div
                        onClick={e =>
                            HandleScroll(
                                e,
                                buble?.message_quoted?.message_id as ID
                            )
                        }
                        className={`overflow-hidden cursor-pointer w-full flex rounded-lg mb-2 ${
                            isFromMe
                                ? 'bg-slate-950/[0.6]'
                                : 'bg-zinc-950/[0.6]'
                        }`}
                    >
                        <div className='w-[4px] flex items-stretch bg-slate-300 rounded-b-full rounded-t-full'></div>
                        <div className='p-2 flex flex-col gap-1'>
                            <p className='text-zinc-400 text-sm font-medium'>
                                {buble.message_quoted.from_name}
                            </p>
                            <p className='text-zinc-500 text-xs font-normal'>
                                {truncateFiltration(
                                    buble?.message_quoted?.message_text as ID
                                )}
                            </p>
                        </div>
                    </div>
                )}
                <div>
                    <pre
                        className='mt-1 px-2 h-full whitespace-pre-wrap text-base font-inherit'
                        style={{ fontFamily: 'inherit' }}
                    >
                        {buble.message_text}
                    </pre>
                </div>
                <p className='px-2 mb-1 mt-1 w-full text-end text-xs font-normal text-zinc-500'>
                    {timestamp(buble.message_timestamp)}
                </p>
            </div>
        </div>
    );
}
