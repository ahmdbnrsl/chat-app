'use client';
import { useRouter } from 'next/navigation';
import { FaArrowRight } from 'react-icons/fa6';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { useState } from 'react';
import { signIn } from 'next-auth/react';

export default function LoginPage({ searchParams }: any) {
    const { push } = useRouter();
    const [wa, setWa] = useState<string>('');
    const [Header, setHeader] = useState<string>(
        'Enter your valid WhatsApp number'
    );
    const [subHeader, setSubHeader] = useState<string>(
        'benChat will send OTP verification to your WhatsApp number'
    );
    const [hiddenForm, setHiddenForm] = useState<boolean>(false);
    const [load, setLoad] = useState<boolean>(false);
    const callbackUrl = searchParams.callbackUrl || '/';

    const SendOTP = async (e: any) => {
        e.preventDefault();

        const wa_number = (document.querySelector('.phone') as HTMLInputElement)
            .value;
        if (wa_number.length > 9) {
            setLoad(true);
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    wa_number,
                    secret: process.env.NEXT_PUBLIC_SECRET,
                    created_at: Date.now(),
                    expired_at: Date.now() + 1000 * 60 * 60 * 24
                })
            };
            const res: Response = await fetch(
                'https://chat-app-rouge-alpha.vercel.app/api/send_otp',
                options
            );
            if (res?.ok) {
                const statusRes: any = await res.json();
                if (statusRes?.status) {
                    setHeader('Enter the OTP code');
                    setSubHeader(
                        'benChat has sent an OTP code to your WhatsApp number'
                    );
                    setHiddenForm(true);
                    setLoad(false);
                    setWa(wa_number);
                } else {
                    setLoad(false);
                }
            }
        } else {
            (document.querySelector('.phone') as HTMLInputElement).focus();
        }
    };
    const HandleSubmit = async (e: any) => {
        e.preventDefault();
        const otp: Array<string> = Array(6)
            .fill(0)
            .map((item: any, index: number): string => {
                const char: string = (
                    document.querySelector(
                        `.otp_${item}${index}`
                    ) as HTMLInputElement
                ).value;
                return char;
            });
        try {
            const res = await signIn('credentials', {
                redirect: false,
                wa_number: wa,
                OTP: otp.join(''),
                timestamp: Date.now(),
                callbackUrl
            });
            if (!res?.error) {
                e.target.reset();

                push(callbackUrl);
            } else {
                if (res.status === 401) {
                    console.error(res);
                }
            }
        } catch (err) {
            console.error(err);
        }
        fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                wa_number: wa,
                OTP: otp.join(''),
                timestamp: Date.now()
            })
        });
    };

    return (
        <main className='transition-all bg-zinc-950 w-full min-h-screen font-inter'>
            <nav className='px-3 sm:px-4 md:px-5 lg:px-6 pt-8 flex justify-between gap-3'>
                <p className='tracking-wider text-sky-500 font-bold text-lg sm:text-xl'>
                    ⟨
                </p>
                <h1 className='tracking-wider text-zinc-200 font-medium text-lg sm:text-xl'>
                    {Header}
                </h1>
                <p className='tracking-wider text-sky-500 font-bold text-lg sm:text-xl'>
                    <HiOutlineDotsVertical />
                </p>
            </nav>
            <section className='px-3 sm:px-4 md:px-5 lg:px-6 flex flex-col items-center'>
                <p className='mt-5 text-base text-zinc-400 font-medium tracking-wide'>
                    {subHeader}
                </p>
                <form
                    onSubmit={HandleSubmit}
                    className='mt-8 flex flex-col items-center'
                >
                    {!hiddenForm ? (
                        <>
                            <input
                                name='phone'
                                type='text'
                                className='phone text-sky-500 text-lg sm:text-xl font-semibold tracking-widest px-3 py-1 bg-transparent outline-0 border-b-4 border-zinc-700 focus:border-zinc-500 placeholder:text-base placeholder:tracking-wider placeholder:text-zinc-600 placeholder:font-medium text-center w-auto max-w-xs'
                                placeholder='Paste or type WhatsApp number'
                            />
                            <button
                                type='submit'
                                onClick={SendOTP}
                                className='box-border flex justify-center items-center gap-2 mt-8 outline-0 bg-zinc-900 rounded-full px-5 py-1.5 w-full text-sky-500 text-lg font-medium tracking-widest hover:bg-zinc-800'
                            >
                                {load ? 'Sending OTP...' : 'Send OTP'}
                            </button>
                        </>
                    ) : (
                        <>
                            <div className='flex gap-2 items-center'>
                                {Array(6)
                                    .fill(0)
                                    .map((item: any, index: number) => (
                                        <>
                                            <input
                                                type='text'
                                                maxLength={1}
                                                name={`otp_${item}${index}`}
                                                className={`otp_${item}${index} p-1 text-center rounded-lg border-4 border-zinc-700 bg-zinc-900 outline-0 text-xl font-semibold text-sky-500 w-12 focus:border-zinc-500`}
                                            />
                                            {index === 2 ? (
                                                <div className='px-3 py-0.5 mx-1 bg-zinc-700 rounded'></div>
                                            ) : (
                                                ''
                                            )}
                                        </>
                                    ))}
                            </div>

                            <button
                                type='submit'
                                onSubmit={HandleSubmit}
                                className='box-border flex justify-center items-center gap-2 mt-8 outline-0 bg-zinc-900 rounded-full px-5 py-1.5 w-full text-sky-500 text-lg font-medium tracking-widest hover:bg-zinc-800'
                            >
                                Verify OTP
                            </button>
                        </>
                    )}
                </form>
            </section>
        </main>
    );
}
