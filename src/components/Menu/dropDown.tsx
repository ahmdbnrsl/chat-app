'use client';

import { forwardRef } from 'react';
import { useManageQuoted } from '@/lib/useManageQuoted';
import type { DropdownProps } from '@/types';

const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
    ({ isOpen, positionTop, buble, profileName }, ref) => {
        const { add } = useManageQuoted();
        const handleReply = () => {
            add({
                message_text: buble.message_text,
                message_id: buble.message_id,
                from_name: profileName
            });
        };
        if (isOpen) {
            return (
                <div
                    ref={ref}
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
                            onClick={handleReply}
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
            );
        }
        return null;
    }
);

Dropdown.displayName = 'Dropdown';
export default Dropdown;
