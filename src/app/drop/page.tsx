'use client';

import { useState, useRef } from 'react';
import { useOnClickOutside } from 'usehooks-ts';

export default function Dropdown() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(menuRef, () => setIsOpen(false));
    const toggleDropdown = () => setIsOpen(true);

    return (
        <div className='w-full h-screen flex justify-center items-center'>
            <div className='relative inline-block text-left'>
                <button
                    onClick={toggleDropdown}
                    className='inline-flex w-full justify-center rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'
                >
                    Options
                </button>

                {isOpen && (
                    <div
                        ref={menuRef}
                        className='absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'
                    >
                        <div
                            className='py-1'
                            role='menu'
                            aria-orientation='vertical'
                            aria-labelledby='options-menu'
                        >
                            <button
                                onClick={() => alert('Profile selected')}
                                className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                role='menuitem'
                            >
                                Profile
                            </button>
                            <button
                                onClick={() => alert('Settings selected')}
                                className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                role='menuitem'
                            >
                                Settings
                            </button>
                            <button
                                onClick={() => alert('Logout selected')}
                                className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                role='menuitem'
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
