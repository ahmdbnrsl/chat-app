'use client';

import { useState, useRef, useEffect } from 'react';
import { useOnClickOutside } from 'usehooks-ts';

export default function Dropdown() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [menuStyles, setMenuStyles] = useState({});
    const buttonRef = useRef(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(menuRef, () => setIsOpen(false));
    const toggleDropdown = () => setIsOpen(!isOpen);

    useEffect(() => {
        if (isOpen && buttonRef.current && menuRef.current) {
            const buttonRect = buttonRef.current.getBoundingClientRect();
            const menuRect = menuRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;
            const isBelow =
                buttonRect.bottom + menuRect.height < viewportHeight;
            const top = isBelow
                ? buttonRect.bottom
                : buttonRect.top - menuRect.height;
            const isRight = buttonRect.right + menuRect.width < viewportWidth;
            const left = isRight
                ? buttonRect.left
                : buttonRect.right - menuRect.width;

            setMenuStyles({
                top: `${top}px`,
                left: `${left}px`,
                position: 'absolute'
            });
        }
    }, [isOpen]);

    return (
        <div className='w-full h-screen flex justify-center items-center'>
            <div className='relative inline-block text-left'>
                <button
                    ref={buttonRef}
                    onClick={toggleDropdown}
                    className='inline-flex w-full justify-center rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'
                >
                    Options
                </button>

                {isOpen && (
                    <div
                        style={menuStyles}
                        ref={menuRef}
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
