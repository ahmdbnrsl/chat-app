'use client';

import { forwardRef, useState } from 'react';
import { useManageQuoted } from '@/lib/useManageQuoted';
import type { DropdownProps } from '@/types';
import { FaArrowLeft } from 'react-icons/fa6';
import { MdContentCopy, MdDeleteOutline } from 'react-icons/md';
import { FetcherService as deleteMessage } from '@/services/fetcherService';
import DropDownBtn from '@/components/Buttons/dropdownBtn';

const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
    ({ isOpen, positionTop, buble, profileName, isFromMe }, ref) => {
        const { add } = useManageQuoted();
        const [load, setLoad] = useState<boolean>(false);
        const [isCopied, setIsCopied] = useState<boolean>(false);
        const handleReply = () => {
            add({
                message_text: buble.message_text,
                message_id: buble.message_id,
                from_name: profileName
            });
        };
        const handleDelete = async () => {
            setLoad(true);
            let deleted = await deleteMessage(
                { message_id: buble.message_id },
                { path: 'delete_message', method: 'DELETE' }
            );
            setLoad(false);
        };
        const handleCopy = () => {
            window.navigator.clipboard.writeText(buble.message_text);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 500);
        };
        if (isOpen) {
            return (
                <div
                    ref={ref}
                    style={{ top: positionTop + 'px' }}
                    className='absolute z-10 mt-2 w-56 rounded-md bg-zinc-900 shadow-xl shadow-zinc-950 focus:outline-none !opacity-100'
                >
                    <div
                        className='py-1'
                        role='menu'
                        aria-orientation='vertical'
                        aria-labelledby='options-menu'
                    >
                        <DropDownBtn onClicking={handleReply}>
                            <FaArrowLeft /> Reply
                        </DropDownBtn>
                        <DropDownBtn onClicking={handleCopy}>
                            <MdContentCopy /> Copy
                        </DropDownBtn>
                        {isFromMe && (
                            <DropDownBtn
                                onClicking={handleDelete}
                                isDisabled={load}
                            >
                                <MdDeleteOutline />
                                {load ? 'Deleting...' : 'Delete'}
                            </DropDownBtn>
                        )}
                    </div>
                </div>
            );
        }
        return null;
    }
);

Dropdown.displayName = 'Dropdown';
export default Dropdown;
