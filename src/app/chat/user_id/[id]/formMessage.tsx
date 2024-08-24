'use client';
import Loading from '@/components/loading';
import { FaPaperPlane } from 'react-icons/fa';
import { useRef, useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { sendMessage } from './message_service';

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
        const send = await sendMessage({
            sender_id: userId,
            receiver_id: paramsId,
            message_text: ev.message.value,
            message_timestamp: Date.now().toString()
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
        <form
            onSubmit={HandleSendMessage}
            className='sticky bottom-0 bg-zinc-950 w-full py-4 px-6 flex border-t gap-3 border-zinc-800 justify-center items-center'
        >
            <textarea
                disabled={isDisabled}
                ref={textareaRef}
                value={textareaValue}
                name='message'
                onChange={MessageChangeValidate}
                placeholder='Type your message...'
                className='form_sendmessage max-h-40 resize-none w-full py-1 px-2.5 sm:py-2 sm:px-4 text-zinc-300 font-normal text-base rounded-3xl bg-zinc-900/[0.5] outline-0 border-2 border-zinc-800 focus:border-zinc-700 placeholder:text-zinc-400 placeholder:text-sm sm:placeholder:text-base'
            ></textarea>
            <button
                disabled={disable}
                type='submit'
                className={`flex justify-center items-center p-4  cursor-pointer ${
                    load
                        ? 'bg-zinc-800 text-zinc-500 px-5 py-4'
                        : 'bg-gradient-to-br from-zinc-200 to-zinc-400 text-zinc-950'
                } text-lg rounded-full outline-0 font-medium`}
            >
                {load ? <Loading /> : <FaPaperPlane />}
            </button>
        </form>
    );
}
