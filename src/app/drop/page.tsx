'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useOnClickOutside } from 'usehooks-ts';

export default function Dropdown() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [menuStyles, setMenuStyles] = useState<React.CSSProperties>({
        position: 'absolute',
        top: '0px',
        left: '0px',
        visibility: 'hidden'
    });
    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(menuRef, () => setIsOpen(false));

    const calculatePosition = useCallback(() => {
        if (buttonRef.current && menuRef.current) {
            const buttonRect = buttonRef.current.getBoundingClientRect();
            const menuRect = menuRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;

            const isBelow =
                buttonRect.bottom + menuRect.height <= viewportHeight;
            const isRight = buttonRect.left + menuRect.width <= viewportWidth;

            const top = isBelow
                ? buttonRect.bottom + window.scrollY
                : buttonRect.top - menuRect.height + window.scrollY;
            const left = isRight
                ? buttonRect.left + window.scrollX
                : buttonRect.right - menuRect.width + window.scrollX;

            setMenuStyles({
                top: `${top}px`,
                left: `${left}px`,
                position: 'absolute'
            });
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            calculatePosition();
        }
    }, [isOpen, calculatePosition]);

    return (
        <div className='w-full h-screen flex justify-center items-center'>
            <div className='relative inline-block text-left'>
                <button
                    ref={buttonRef}
                    onClick={() => setIsOpen(!isOpen)}
                    className='inline-flex w-full justify-center rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'
                >
                    Options
                </button>

                {isOpen && (
                    <div
                        ref={menuRef}
                        style={menuStyles}
                        className='z-10 mt-2 w-56 rounded-md bg-zinc-900 shadow-lg focus:outline-none'
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
