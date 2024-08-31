'use client';
import CircleButton from '@/components/Buttons/circle';
import { useRef, useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { FetcherService as sendMessage } from '@/services/fetcherService';

export default function FormMessagge({
    paramsId,
    userId,
    isDisabled
}: {
    paramsId: string;
    userId: string;
    isDisabled: boolean;
}) {
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
        const send = await sendMessage(
            {
                sender_id: userId,
                receiver_id: paramsId,
                message_text: ev.message.value,
                message_timestamp: Date.now().toString()
            },
            { path: 'push_message', method: 'POST' }
        );
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
        <form
            onSubmit={HandleSendMessage}
            className='sticky bottom-0 bg-zinc-950 w-full py-4 px-6 flex gap-3 justify-center items-center'
        >
            <textarea
                disabled={isDisabled}
                ref={textareaRef}
                value={textareaValue}
                name='message'
                onChange={MessageChangeValidate}
                placeholder='Type your message...'
                className='form_sendmessage max-h-40 resize-none w-full py-1 px-2.5 sm:py-2 sm:px-4 text-zinc-300 font-normal text-base outline-0 border-0 bg-zinc-900/[0.75] rounded-lg placeholder:text-zinc-400 placeholder:text-sm sm:placeholder:text-base'
            ></textarea>
            <CircleButton
                isLoad={load}
                isDisabled={disable}
            />
        </form>
    );
}
