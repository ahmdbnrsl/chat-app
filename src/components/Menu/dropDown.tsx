'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useOnClickOutside } from 'usehooks-ts';

export default function Dropdown() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [positionTop, setPositionTop] = useState<string>('0');
    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(menuRef, () => setIsOpen(false));
    const isFromMe = false;

    const calculatePosition = useCallback(() => {
        if (buttonRef.current && menuRef.current) {
            const spaceRemaining =
                window.innerHeight -
                buttonRef.current.getBoundingClientRect().bottom;
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
    return (
        <div className='bg-zinc-950 w-full h-screen flex justify-center items-center flex-col'>
            <div className='h-[90vh] w-full'></div>
            <div className='relative inline-block text-left'>
                <button
                    ref={buttonRef}
                    onClick={() => {
                        setIsOpen(!isOpen);
                    }}
                    className='inline-flex w-full justify-center rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'
                >
                    Options
                </button>

                {isOpen && (
                    <div
                        ref={menuRef}
                        style={{ top: positionTop + 'px' }}
                        className='absolute z-10 mt-2 w-56 rounded-md bg-zinc-900 shadow-lg focus:outline-none'
                    >
                        <div
                            className='py-1'
                            role='menu'
                            aria-orientation='vertical'
                            aria-labelledby='options-menu'
                        >
                            <button
                                className='w-full text-left px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-950/[0.4] hover:text-zinc-300'
                                role='menuitem'
                            >
                                Reply
                            </button>
                            <button
                                className='w-full text-left px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-950/[0.4] hover:text-zinc-300'
                                role='menuitem'
                            >
                                Copy
                            </button>
                            <button
                                className='w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-zinc-950/[0.4] hover:text-red-500'
                                role='menuitem'
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
