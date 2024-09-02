'use client';

import CircleButton from '@/components/Buttons/circle';
import { useRef, useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { FetcherService as sendMessage } from '@/services/fetcherService';
import { useManageQuoted } from '@/lib/useManageQuoted';
import type { M } from '@/types';
import { IoMdClose } from 'react-icons/io';

export default function FormMessagge({
    paramsId,
    userId,
    isDisabled
}: {
    paramsId: string;
    userId: string;
    isDisabled: boolean;
}) {
    const { quotedInfo, reset } = useManageQuoted();
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [textareaValue, setTextareaValue] = useState<string>('');
    const [load, setLoad] = useState<boolean>(false);
    const [disable, setDisable] = useState<boolean>(true);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(
                textareaRef.current.scrollHeight,
                320
            )}px`;
        }
    }, [textareaValue]);

    const HandleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoad(true);
        setDisable(true);

        const ev = e.target as typeof e.target & { message: { value: string } };
        const messageOptions: M['SendMessage'] = {
            sender_id: userId,
            receiver_id: paramsId,
            message_text: ev.message.value,
            message_timestamp: Date.now().toString()
        };
        if (quotedInfo) messageOptions.message_quoted = quotedInfo;
        const send = await sendMessage(messageOptions, {
            path: 'push_message',
            method: 'POST'
        });
        if (send) {
            if (send?.status) {
                (e.target as HTMLFormElement).reset();
                setTextareaValue('');
                window.scrollTo(0, document.body.scrollHeight);
            } else {
                window.navigator.vibrate(200);
            }
        }
        setLoad(false);
    };

    const MessageChangeValidate = (
        e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
        setDisable(e.target.value.length === 0);
        setTextareaValue(e.target.value);
    };
    return (
        <div className='sticky bottom-0 bg-zinc-950 flex flex-col w-full gap-2.5'>
            {quotedInfo && (
                <div className='w-full mx-6 my-4 py-1 px-2.5 sm:py-2 sm:px-4 bg-zinc-900/[0.75] flex flex-col items-end relative'>
                    <div className='flex flex-col w-full gap-1.5'>
                        <p className='text-sm font-medium text-zinc-400'>
                            {quotedInfo.from_name}
                        </p>
                        <p className='text-xs font-normal text-zinc-500'>
                            {quotedInfo.message_text}
                        </p>
                    </div>
                    <button
                        onClick={reset}
                        className='py-1 px-2 rounded bg-zinc-800 text-sm text-zinc-400 absolute'
                    >
                        <IoMdClose />
                    </button>
                </div>
            )}
            <form
                onSubmit={HandleSendMessage}
                className='w-full py-4 px-6 flex gap-3 justify-center items-center'
            >
                <textarea
                    disabled={isDisabled}
                    ref={textareaRef}
                    value={textareaValue}
                    name='message'
                    onChange={MessageChangeValidate}
                    placeholder='Type your message...'
                    className='form_sendmessage max-h-40 resize-none w-full py-1 px-2.5 sm:py-2 sm:px-4 text-zinc-300 font-normal text-base outline-0 border-0 rounded-lg placeholder:text-zinc-500 placeholder:text-sm sm:placeholder:text-base'
                ></textarea>
                <CircleButton
                    isLoad={load}
                    isDisabled={disable}
                />
            </form>
        </div>
    );
}
