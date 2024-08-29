'use client';

import { FaUserPlus } from 'react-icons/fa6';
import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { FetcherService as userSignUp } from '@/services/fetcherService';
import Link from 'next/link';
import Loading from '@/components/loading';
import AuthButton from '@/components/Buttons/auth';
import AuthLabel from '@/components/Labels/auth';
import AuthInput from '@/components/Inputs/auth';
import type { U } from '@/types';

export default function SignUpPage() {
    const { push } = useRouter();
    const [load, setLoad] = useState<boolean>(false);
    const [labelName, setLabelName] = useState<string>('Enter your fullname');
    const [labelWaNumber, setLabelWaNumber] = useState<string>(
        'Enter your WhatsApp number'
    );
    const [err, setErr] = useState<{ status: boolean; message: string }>({
        status: false,
        message: ''
    });

    const SignUp = async (e: FormEvent<HTMLFormElement>) => {
        interface Data extends EventTarget {
            name: HTMLInputElement;
            wa: HTMLInputElement;
        }
        e.preventDefault();
        const ev: Data = e.target as Data;
        const nameUser = ev.name.value;
        const waNumber = ev.wa.value;
        const validate = (data: string, type: string): boolean => {
            if (type === 'name') {
                return data === '' ||
                    (data !== '' && data.replace(/\s/g, '') === '') ||
                    data.length < 5 ||
                    data.length > 25
                    ? false
                    : true;
            } else {
                return data === '' ||
                    !Number(data) ||
                    data.length < 9 ||
                    data.length > 20
                    ? false
                    : true;
            }
        };
        if (!validate(nameUser, 'name')) {
            ev.name.focus();
        } else if (!validate(waNumber, 'wa')) {
            ev.wa.focus();
        } else {
            setLoad(true);
            const user: U['UserInfo'] | false = (await userSignUp(
                {
                    wa_number: waNumber,
                    name: nameUser,
                    created_at: Date.now().toString()
                },
                { path: 'register', method: 'POST' }
            )) as U['UserInfo'];
            if (user) {
                if (user?.status) {
                    setLoad(false);
                    (e.target as HTMLFormElement).reset();
                    push('/login');
                } else {
                    setLoad(false);
                    setErr({
                        status: true,
                        message: user?.message
                    });
                }
            } else {
                setLoad(false);
                setErr({
                    status: true,
                    message: 'Something went wrong!'
                });
            }
        }
    };

    const InputChangeValidate = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.className.startsWith('name')) {
            const data = e.target.value;
            if (data !== '' && data.replace(/\s/g, '') === '')
                setLabelName('Name must not only space!');
            if (data.length < 5) setLabelName('Enter at least 5 letters');
            if (data.length > 25) setLabelName('Limit 25 letters');
            if (
                data === '' ||
                (data.length >= 5 &&
                    data.length <= 25 &&
                    data.replace(/\s/g, '') !== '')
            )
                setLabelName('Enter your fullname');
        } else {
            const data = e.target.value;
            if (!Number(data)) setLabelWaNumber('Enter number only');
            if (data.length < 9) setLabelWaNumber('Enter at least 9 digits');
            if (data.length > 20) setLabelWaNumber('Limit 20 numbers');
            if (
                data === '' ||
                (data.length >= 9 && data.length < 21 && Number(data))
            )
                setLabelWaNumber('Enter your WhatsApp number');
        }
    };

    return (
        <>
            <div className='w-full p-4 flex flex-col items-center mt-2'>
                <h1 className='flex items-center gap-2 text-2xl font-bold text-zinc-300 text-center'>
                    <FaUserPlus /> Sign Up
                </h1>
                <p
                    className={`mt-3 text-base font-normal text-center ${
                        err.status ? 'text-red-500' : 'text-zinc-400'
                    }`}
                >
                    {err.status
                        ? err.message
                        : 'Welcome back!, please enter your detail below'}
                </p>
            </div>
            <form
                onSubmit={SignUp}
                className='p-4 w-full flex flex-col gap-4'
            >
                <div className='w-full flex flex-col items-start'>
                    <AuthInput
                        identifier='name'
                        type='text'
                        onChanging={InputChangeValidate}
                        maxs={25}
                    />

                    <AuthLabel forInput='name'>{labelName}</AuthLabel>
                </div>
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
                    onDisabling={load}
                    type='submit'
                    onLoading={load}
                    loadingText='Loading...'
                >
                    Sign Up
                </AuthButton>
            </form>
            <p className='px-4 text-center w-full text-zinc-400 text-base mt-2 mb-7 font-normal flex justify-center gap-1'>
                Already have an account?{' '}
                <Link
                    href='/login'
                    className='text-zinc-200 font-medium cursor-pointer visited:underline'
                >
                    Login
                </Link>
            </p>
        </>
    );
}
