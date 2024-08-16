'use client';
import Avatar from 'react-avatar';
import Loading from '@/components/loading';
import {
    useEffect,
    useState,
    useCallback,
    useMemo,
    ChangeEvent,
    FormEvent
} from 'react';
import { useSession } from 'next-auth/react';
import { getListMessage, getSenderInfo, sendMessage } from './message_service';
import { Message } from '@/models/messages';
import { User } from '@/models/users';
import { FaPaperPlane } from 'react-icons/fa';

export default function MobileView(props: any) {
    const { data: session, status }: { data: any; status: string } =
        useSession();
    const [listMessage, setListMessage] = useState<
        undefined | null | Array<Message>
    >(null);
    const [senderInfo, setSenderInfo] = useState<undefined | null | User>(null);
    const [load, setLoad] = useState<boolean>(false);
    const [disable, setDisable] = useState<boolean>(true);
    const { params } = props;

    useEffect(() => {
        if (!session?.user?.user_id || !params.id) return;

        const fetchSenderInfo = async () => {
            const res = await getSenderInfo(params.id);
            if (res && res.status) setSenderInfo(res.result);
        };

        const fetchMessages = async () => {
            const res = await getListMessage(session.user.user_id, params.id);
            if (res && res.status) setListMessage(res.result?.reverse());
        };

        fetchSenderInfo();
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [session?.user?.user_id, params.id]);

    const getTimestamp = useCallback((isDate: string): string => {
        const date = new Date(Number(isDate));
        return `${String(date.getHours()).padStart(2, '0')}:${String(
            date.getMinutes()
        ).padStart(2, '0')}`;
    }, []);

    const HandleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoad(true);
        setDisable(true);

        const ev = e.target as typeof e.target & { message: { value: string } };
        const send = await sendMessage({
            sender_id: session?.user?.user_id,
            receiver_id: params.id,
            message_text: ev.message.value,
            message_timestamp: Date.now().toString()
        });
        if (send) {
            if (send?.status) {
                (e.target as HTMLFormElement).reset();
            } else {
                window.navigator.vibrate(200);
            }
        }
        setLoad(false);
    };

    const MessageChangeValidate = (e: ChangeEvent<HTMLInputElement>) => {
        setDisable(e.target.value.length === 0);
    };
    return (
        <main className='bg-zinc-950 w-full min-h-screen flex'>
            <section className='w-full flex flex-col min-h-screen bg-ornament bg-fixed bg-zinc-950'>
                <nav className='sticky top-0 z-20 bg-zinc-900 w-full py-4 px-6 flex flex-col md:flex-row gap-3 border-b border-zinc-800 items-center'>
                    <div className='flex justify-between w-full items-center'>
                        <div className='flex items-center gap-3'>
                            <button className='p-3 text-zinc-300 font-medium text-lg sm:text-xl md:text-2xl outline-0 bg-transparent border-0 rounded-full hover:bg-zinc-800'>
                                <Avatar
                                    name={senderInfo ? senderInfo?.name : 'U'}
                                    size='35'
                                    round={true}
                                />
                            </button>
                            <div className='flex flex-col'>
                                <h1 className='text-zinc-200 text-lg sm:text-xl font-semibold tracking-normal'>
                                    {senderInfo ? senderInfo?.name : ''}
                                </h1>
                                <p className='text-xs font-normal text-zinc-400'>
                                    {senderInfo
                                        ? '+' + senderInfo?.wa_number
                                        : ''}
                                </p>
                            </div>
                        </div>
                    </div>
                    <input
                        type='text'
                        placeholder='Search message'
                        className='w-full py-1 px-2.5 sm:py-2 sm:px-4 text-zinc-300 font-normal text-base sm:text-lg rounded-lg bg-zinc-800/[0.5] outline-0 border-2 border-zinc-800 focus:border-zinc-700 placeholder:text-zinc-400 placeholder:text-sm sm:placeholder:text-base'
                    />
                </nav>
                <div className='w-full flex flex-col-reverse gap-3 p-6 flex-grow'>
                    {listMessage &&
                        listMessage.map((message: Message) => (
                            <div
                                key={message?.message_timestamp}
                                className={`w-full flex ${
                                    message.sender_id === session?.user?.user_id
                                        ? 'justify-end'
                                        : 'justify-start'
                                }`}
                            >
                                <div
                                    className={`w-fit text-zinc-300 py-1 min-w-[8rem] px-4 flex flex-col ${
                                        message.sender_id ===
                                        session?.user?.user_id
                                            ? 'bg-zinc-700 rounded-b-xl rounded-tl-xl'
                                            : 'bg-zinc-900 rounded-b-xl rounded-tr-xl'
                                    }`}
                                >
                                    <p>{message.message_text}</p>
                                    <p className='mt-1 w-full text-end text-xs font-normal text-zinc-400'>
                                        {getTimestamp(
                                            message.message_timestamp
                                        )}
                                    </p>
                                </div>
                            </div>
                        ))}
                </div>
                <form
                    onSubmit={HandleSendMessage}
                    className='sticky bottom-0 bg-zinc-900 w-full py-4 px-6 flex border-t gap-3 border-zinc-800 justify-center'
                >
                    <input
                        name='message'
                        onChange={MessageChangeValidate}
                        type='text'
                        placeholder='Type your message...'
                        className='w-full py-1 px-2.5 sm:py-2 sm:px-4 text-zinc-300 font-normal text-base sm:text-lg rounded-lg bg-zinc-800/[0.5] outline-0 border-2 border-zinc-800 focus:border-zinc-700 placeholder:text-zinc-400 placeholder:text-sm sm:placeholder:text-base'
                    />
                    <button
                        disabled={disable}
                        type='submit'
                        className={`flex justify-center items-center py-1 px-4 cursor-pointer ${
                            load
                                ? 'bg-zinc-800 text-zinc-500'
                                : 'bg-gradient-to-br from-zinc-200 to-zinc-400 text-zinc-950'
                        } text-lg rounded-xl outline-0 font-medium`}
                    >
                        {load ? <Loading /> : <FaPaperPlane />}
                    </button>
                </form>
            </section>
        </main>
    );
}
