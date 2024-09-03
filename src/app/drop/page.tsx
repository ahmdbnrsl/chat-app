'use client';

import * as React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDownIcon } from 'lucide-react';

export default function Dropdown() {
    return (
        <main className='flex min-h-screen flex-col items-center justify-center p-24'>
            <h1 className='text-2xl mb-4'>Welcome to My App</h1>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <button className='inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600'>
                        Options <ChevronDownIcon className='ml-2 h-4 w-4' />
                    </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        className='bg-white border rounded-md shadow-md p-1'
                        align='end'
                        sideOffset={5}
                    >
                        <DropdownMenu.Item className='px-4 py-2 cursor-pointer hover:bg-gray-100'>
                            Profile
                        </DropdownMenu.Item>
                        <DropdownMenu.Item className='px-4 py-2 cursor-pointer hover:bg-gray-100'>
                            Settings
                        </DropdownMenu.Item>
                        <DropdownMenu.Item className='px-4 py-2 cursor-pointer hover:bg-gray-100'>
                            Log out
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>
        </main>
    );
}
