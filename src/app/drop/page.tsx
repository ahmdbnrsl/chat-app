'use client';

import { useState, useRef, useEffect } from 'react';
import { useClickAway } from 'react-use';

export default function DropdownMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useClickAway(menuRef, () => setIsOpen(false));

    const toggleDropdown = () => {
        setIsOpen(!isOpen);

        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const menuHeight = 150;
            const menuWidth = 200;

            let top = rect.bottom;
            let left = rect.left;

            if (rect.bottom + menuHeight > window.innerHeight) {
                top = rect.top - menuHeight;
            }
            if (rect.left + menuWidth > window.innerWidth) {
                left = rect.left - (rect.left + menuWidth - window.innerWidth);
            }

            setPosition({ top, left });
        }
    };

    return (
        <div className='flex justify-center items-center h-screen bg-gray-100'>
            <div className='relative'>
                <button
                    ref={buttonRef}
                    onClick={toggleDropdown}
                    className='px-4 py-2 bg-blue-500 text-white rounded'
                >
                    Toggle Dropdown
                </button>

                {isOpen && (
                    <div
                        ref={menuRef}
                        style={{ top: position.top, left: position.left }}
                        className='absolute z-10 w-48 bg-white shadow-lg border rounded'
                    >
                        <ul>
                            <li className='px-4 py-2 hover:bg-gray-200 cursor-pointer'>
                                Option 1
                            </li>
                            <li className='px-4 py-2 hover:bg-gray-200 cursor-pointer'>
                                Option 2
                            </li>
                            <li className='px-4 py-2 hover:bg-gray-200 cursor-pointer'>
                                Option 3
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
