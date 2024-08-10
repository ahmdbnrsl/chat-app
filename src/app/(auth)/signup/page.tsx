'use client';

import { FaUserPlus } from 'react-icons/fa6';
import { useState, ChangeEvent, FormEvent } from 'react';
import Loading from './loading';

export default function SignUpPage() {
    const [load, setLoad] = useState<boolean>(false);
    const [labelName, setLabelName] = useState<string>('Enter your fullname');
    const [labelWaNumber, setLabelWaNumber] = useState<string>(
        'Enter your WhatsApp number (e.g, 08212345)'
    );

    const SignUp = (e: FormEvent<HTMLFormElement>) => {
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
                if (
                    data === '' ||
                    (data !== '' && data.replace(/\s/g, '') === '') ||
                    data.length < 5 ||
                    data.length > 25
                ) {
                    return false;
                } else return true;
            } else {
                if (
                    data === '' ||
                    !Number(data) ||
                    data.length < 9 ||
                    data.length > 20
                ) {
                    return false;
                } else return true;
            }
        };
        if (!validate(nameUser, 'name')) {
            ev.name.focus();
        } else if (!validate(waNumber, 'wa')) {
            ev.wa.focus();
        } else {
            setLoad(true);
        }
    };

    const InputChangeValidate = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.className.startsWith('name')) {
            const data = e.target.value;
            if (data !== '' && data.replace(/\s/g, '') === '')
                setLabelName('Name must not only space!');
            if (data.length < 5) setLabelName('Enter at least 5 letters');
            if (data.length > 25)
                setLabelName('Name must not exceed 25 letters');
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
            if (data.length > 20)
                setLabelWaNumber('WhatsApp number must not exceed 20 numbers');
            if (
                data === '' ||
                (data.length >= 9 && data.length < 21 && Number(data))
            )
                setLabelWaNumber('Enter your WhatsApp number (e.g, 08212345)');
        }
    };

    return (
        <main className='transition-all w-full min-h-screen bg-zinc-950 bg-ornament bg-[length:500px]'>
            <section className='w-full min-h-screen p-5 flex flex-col justify-center items-center'>
                <div className='w-full max-w-md bg-zinc-950 rounded-xl shadow shadow-xl shadow-zinc-950 flex flex-col border-2 border-zinc-800'>
                    <div className='scale-[1.017] bg-gradient-to-br from-zinc-400 to-zinc-950 p-[1.5px] rounded-xl hover:-translate-y-1'>
                        <div className='w-full rounded-xl p-4 bg-zinc-900 flex flex-col'>
                            <h1 className='flex items-center gap-2 text-xl font-bold text-zinc-300'>
                                <FaUserPlus /> Sign Up
                            </h1>
                            <p className='mt-3 text-base font-normal text-zinc-400'>
                                Welcome back!, please enter your detail below
                            </p>
                        </div>
                    </div>
                    <form
                        onSubmit={SignUp}
                        className='p-4 mt-3 w-full flex flex-col gap-4'
                    >
                        <div className='w-full flex flex-col items-start'>
                            <input
                                onChange={InputChangeValidate}
                                type='text'
                                id='name'
                                name='name'
                                maxLength={25}
                                placeholder='...'
                                className='name peer w-full bg-zinc-950 outline-0 text-lg font-normal text-zinc-200 tracking-wider rounded-xl px-4 py-2 border-4 border-zinc-900 placeholder:text-transparent focus:border-zinc-500'
                            />
                            <label
                                htmlFor='name'
                                className='absolute -translate-y-3 peer-placeholder-shown:translate-y-3 ml-3 text-sm font-normal text-zinc-500 peer-focus:-translate-y-3 bg-zinc-950 w-auto px-2 py-1 peer-focus:text-zinc-300'
                            >
                                {labelName}
                            </label>
                        </div>
                        <div className='w-full flex flex-col gap-1'>
                            <input
                                onChange={InputChangeValidate}
                                type='text'
                                id='wa'
                                name='wa'
                                maxLength={20}
                                placeholder='...'
                                className='wa peer w-full bg-zinc-950 outline-0 text-lg font-normal text-zinc-200 tracking-widest rounded-xl px-4 py-2 border-4 border-zinc-900 placeholder:text-transparent focus:border-zinc-500'
                            />
                            <label
                                htmlFor='wa'
                                className='absolute -translate-y-3 peer-placeholder-shown:translate-y-3 ml-3 text-sm font-normal text-zinc-500 peer-focus:-translate-y-3 bg-zinc-950 w-auto px-2 py-1 peer-focus:text-zinc-300'
                            >
                                {labelWaNumber}
                            </label>
                        </div>
                        <button
                            disabled={load ? true : false}
                            type='submit'
                            className={`flex gap-2 justify-center items-center py-2 mt-2 w-full ${
                                load
                                    ? 'bg-zinc-900 text-zinc-500'
                                    : 'bg-gradient-to-br from-zinc-200 to-zinc-400 text-zinc-950'
                            } text-lg rounded-xl outline-0 font-medium`}
                        >
                            {load ? (
                                <>
                                    <Loading /> {'Loading...'}
                                </>
                            ) : (
                                'Sign Up'
                            )}
                        </button>
                    </form>
                    <p className='px-4 text-center w-full text-zinc-400 text-sm mt-2 mb-7 font-normal'>
                        Already have an account?{' '}
                        <span className='text-zinc-200 font-medium'>Login</span>
                    </p>
                </div>
            </section>
        </main>
    );
}
