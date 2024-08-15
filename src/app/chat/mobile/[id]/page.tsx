'use client';
import Avatar from 'react-avatar';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getListMessage } from './get_list_message';
import { Message } from '@/models/messages';
import { FaPaperPlane } from 'react-icons/fa';

export default function MobileView(props: any) {
    const { data: session, status }: { data: any; status: string } =
        useSession();
    const [listMessage, setListMessage] = useState<
        undefined | null | Array<Message>
    >(null);
    const { params } = props;
    useEffect(() => {
        if (session?.user?.user_id) {
            getListMessage(session.user.user_id, params.id).then(
                (
                    res:
                        | {
                              status: boolean;
                              message: string;
                              result?: Array<Message>;
                          }
                        | false
                ) => {
                    if (res && res.status) {
                        setListMessage(res?.result?.reverse());
                    }
                }
            );
        }
    }, [session?.user?.user_id, params.id]);
    const getTimestamp = (isDate: string): string => {
        const date: Date = new Date(Number(isDate));
        return (
            String(date.getHours()).padStart(2, '0') +
            ':' +
            String(date.getMinutes()).padStart(2, '0')
        );
    };
    return (
        <main className='bg-zinc-950 w-full min-h-screen flex'>
            <section className='w-full flex flex-col min-h-screen bg-ornament bg-fixed bg-zinc-950'>
                <nav className='sticky top-0 z-20 bg-zinc-900 w-full py-4 px-6 flex flex-col md:flex-row gap-3 border-b border-zinc-800 items-center'>
                    <div className='flex justify-between w-full items-center'>
                        <div className='flex items-center gap-3'>
                            <button className='p-3 text-zinc-300 font-medium text-lg sm:text-xl md:text-2xl outline-0 bg-transparent border-0 rounded-full hover:bg-zinc-800'>
                                <Avatar
                                    name='Via Fitriana'
                                    size='35'
                                    round={true}
                                />
                            </button>
                            <div className='flex flex-col'>
                                <h1 className='text-zinc-200 text-lg sm:text-xl font-semibold tracking-normal'>
                                    Ahmad Beni Rusli
                                </h1>
                                <p className='text-xs font-normal text-zinc-400'>
                                    +6288216018165
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
                <form className='sticky bottom-0 bg-zinc-900 w-full py-4 px-6 flex border-t gap-3 border-zinc-800 justify-center'>
                    <input
                        type='text'
                        placeholder='Type your message...'
                        className='w-full py-1 px-2.5 sm:py-2 sm:px-4 text-zinc-300 font-normal text-base sm:text-lg rounded-lg bg-zinc-800/[0.5] outline-0 border-2 border-zinc-800 focus:border-zinc-700 placeholder:text-zinc-400 placeholder:text-sm sm:placeholder:text-base'
                    />
                    <button
                        type='submit'
                        className='bg-zinc-200 rounded-lg py-1 sm:py-1.5 px-4 outline-0 text-zinc-950 text-center text-base sm:text-lg'
                    >
                        <FaPaperPlane />
                    </button>
                </form>
            </section>
        </main>
    );
}
