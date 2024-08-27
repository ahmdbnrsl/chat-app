'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, FormEvent, ChangeEvent } from 'react';
import { MdOutlinePersonSearch } from 'react-icons/md';
import { FetcherService as getUserInfo } from '@/services/fetcherService';
import type { User, U } from '@/types';
import Loading from '@/components/loading';

export default function ModalForm({ hide }: { hide: () => void }) {
    const { push } = useRouter();
    const { data: session, status }: { data: any; status: string } =
        useSession();
    const [load, setLoad] = useState<boolean>(false);
    const [labelWaNumber, setLabelWaNumber] = useState<string>(
        'Enter WhatsApp number'
    );
    const [err, setErr] = useState<{ status: boolean; message: string }>({
        status: false,
        message: ''
    });
    const InputChangeValidate = (e: ChangeEvent<HTMLInputElement>) => {
        const data = e.target.value;
        if (!Number(data)) setLabelWaNumber('Enter number only');
        if (data.length < 9) setLabelWaNumber('Enter at least 9 digits');
        if (data.length > 20) setLabelWaNumber('Limit 20 numbers');
        if (
            data === '' ||
            (data.length >= 9 && data.length < 21 && Number(data))
        )
            setLabelWaNumber('Enter WhatsApp number');
    };
    const SearchUser = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const ev = e.target as typeof e.target & {
            wa: HTMLInputElement;
        };
        let wa_number: string = ev.wa.value;
        const noValidate = (data: string): boolean => {
            return (
                data === '' ||
                !Number(data) ||
                data.length < 9 ||
                data.length > 20
            );
        };
        if (noValidate(wa_number)) {
            ev.wa.focus();
        } else {
            setLoad(true);
            wa_number = wa_number?.startsWith('0')
                ? wa_number?.replace(/\D/g, '').replace('0', '62')
                : wa_number?.replace(/\D/g, '');
            if (wa_number !== session?.user?.wa_number) {
                const findingUser: U['UserInfo'] | false = (await getUserInfo(
                    {
                        wa_number
                    },
                    { path: 'get_user_info', method: 'POST' }
                )) as U['UserInfo'];
                if (findingUser) {
                    if (findingUser?.status) {
                        setLoad(false);
                        hide();
                        push('/chat/user_id/' + findingUser?.result?.user_id);
                    } else {
                        setLoad(false);
                        setErr({
                            status: true,
                            message: 'User is not registered'
                        });
                    }
                } else {
                    setLoad(false);
                    setErr({ status: true, message: 'Something went wrong!' });
                }
            } else {
                setLoad(false);
                setErr({
                    status: true,
                    message: 'Do not enter your own number'
                });
            }
        }
    };
    return (
        <div className='z-[999999999] w-full max-w-md bg-zinc-900 rounded-xl shadow shadow-xl shadow-zinc-950 flex flex-col border-2 border-zinc-800'>
            <div className='w-full p-4 flex flex-col items-center mt-2'>
                <h1 className='flex items-center gap-2 text-2xl font-bold text-zinc-300 text-center'>
                    <MdOutlinePersonSearch /> Find User
                </h1>
                <p
                    className={`mt-3 text-base font-normal text-center ${
                        err.status ? 'text-red-500' : 'text-zinc-400'
                    }`}
                >
                    {err.status ? err.message : 'Enter a valid WhatsApp number'}
                </p>
            </div>
            <form
                onSubmit={SearchUser}
                className={`flex p-4 w-full flex-col gap-4 mb-4`}
            >
                <div className='w-full flex flex-col gap-1'>
                    <input
                        onChange={InputChangeValidate}
                        type='text'
                        id='wa'
                        name='wa'
                        maxLength={20}
                        placeholder='...'
                        className='wa peer w-full bg-zinc-900 outline-0 text-lg font-normal text-zinc-200 tracking-widest rounded-xl px-4 py-2 border-4 border-zinc-600 placeholder:text-transparent focus:border-zinc-400 cursor-text'
                    />
                    <label
                        htmlFor='wa'
                        className='absolute -translate-y-3 peer-placeholder-shown:translate-y-3 ml-3 text-sm font-normal text-zinc-500 peer-focus:-translate-y-3 bg-zinc-900 w-auto px-2 py-1 peer-focus:text-zinc-300'
                    >
                        {labelWaNumber}
                    </label>
                </div>
                <button
                    disabled={load ? true : false}
                    type='submit'
                    className={`flex gap-2 justify-center items-center py-2 mt-2 w-full cursor-pointer ${
                        load
                            ? 'bg-zinc-800 text-zinc-500'
                            : 'bg-gradient-to-br from-zinc-200 to-zinc-400 text-zinc-950'
                    } text-lg rounded-xl outline-0 font-medium`}
                >
                    {load ? (
                        <>
                            <Loading /> {'Searching...'}
                        </>
                    ) : (
                        'Find user'
                    )}
                </button>
            </form>
        </div>
    );
}
