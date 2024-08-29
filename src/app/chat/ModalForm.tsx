'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, FormEvent, ChangeEvent } from 'react';
import { MdOutlinePersonSearch } from 'react-icons/md';
import { FetcherService as getUserInfo } from '@/services/fetcherService';
import type { User, U } from '@/types';
import Loading from '@/components/loading';
import AuthButton from '@/components/Buttons/auth';
import AuthLabel from '@/components/Labels/auth';
import AuthInput from '@/components/Inputs/auth';

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
                    <AuthInput
                        identifier='wa'
                        type='text'
                        onChanging={InputChangeValidate}
                        maxs={20}
                    />
                    <AuthLabel forInput='wa'>{labelWaNumber}</AuthLabel>
                </div>
                <AuthButton
                    onDisabling={load ? true : false}
                    type='submit'
                    onLoading={load}
                    loadingText='Searching...'
                >
                    Find user
                </AuthButton>
            </form>
        </div>
    );
}
