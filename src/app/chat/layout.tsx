'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { getListSender } from '@/services/messages/getListSender';
import { io } from 'socket.io-client';
import { Message } from '@/models/messages';
import { usePathname } from 'next/navigation';
import SidebarChat from './Sidebar';
import Wrapper from './wrapper';

const socketURL = process.env.NEXT_PUBLIC_SOCKET_URL || '';
const socket = io(socketURL);

interface Result {
    pp: string;
    name: string;
    wa_number: string;
    fromMe: boolean;
    latestMessageText: string;
    latestMessageTimestamp: string;
    id_user: string;
}

export default function Layout({ children }: { children: React.ReactNode }) {
    const { data: session, status }: { data: any; status: string } =
        useSession();
    const [width, setWidth] = useState<number>(0);
    const [listSender, setListSender] = useState<
        Array<Result> | null | undefined
    >(null);

    useEffect(() => {
        async function fetchListSender() {
            const res:
                | { result?: Array<Result>; status: boolean; message: string }
                | false = await getListSender(session?.user.user_id);
            if (res && res?.status) setListSender(res?.result);
        }

        fetchListSender();

        socket.on('connect', () => {
            console.info('live chat opened');
        });

        socket.on('data_updated', (newData: Message) => {
            if (!newData) return;
            if (
                newData.sender_id === session?.user.user_id ||
                newData.receiver_id === session?.user?.user_id
            ) {
                fetchListSender();
            }
        });

        socket.on('data_deleted', () => fetchListSender());

        socket.on('disconnect', () => {
            console.info('live chat closed');
        });

        return () => {
            socket.off('data_updated');
            socket.off('data_deleted');
        };
    }, [session?.user?.user_id]);

    useEffect(() => {
        setWidth(window.innerWidth);
        const handleResize = () => {
            setWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const pathName = usePathname();

    if (pathName.startsWith('/chat/profile')) {
        return <>{children}</>;
    }

    if (width < 1280) {
        if (pathName.startsWith('/chat/user_id')) {
            return <>{children}</>;
        }
        return (
            <main className='bg-zinc-950 w-full min-h-screen flex'>
                <Wrapper>
                    <SidebarChat listSender={listSender} />
                </Wrapper>
            </main>
        );
    }

    return (
        <main className='bg-zinc-950 w-full min-h-screen flex'>
            <Wrapper>
                <SidebarChat listSender={listSender} />
            </Wrapper>
            <section className='hidden w-full xl:flex flex-col min-h-screen xl:w-4/6 bg-zinc-950 bg-fixed justify-center items-center'>
                {children}
            </section>
        </main>
    );
}
