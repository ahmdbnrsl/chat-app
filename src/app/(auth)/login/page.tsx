'use client';

import Head from 'next/head';
import type { O } from '@/types';
import { FaUserLock } from 'react-icons/fa';
import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { FetcherService as sendOTPCode } from '@/services/fetcherService';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import Loading from '@/components/loading';
import AuthButton from '@/components/Buttons/auth';
import AuthLabel from '@/components/Labels/auth';
import AuthInput from '@/components/Inputs/auth';

export default function LoginPage({ searchParams }: any) {
    const { push } = useRouter();
    const callbackUrl = searchParams.callbackUrl || '/chat';
    const [load, setLoad] = useState<boolean>(false);
    const [labelWaNumber, setLabelWaNumber] = useState<string>(
        'Enter your WhatsApp number'
    );
    const [labelOTP, setLabelOTP] = useState<string>('Enter your OTP code');
    const [formHidden, setFormHidden] = useState<boolean>(true);
    const [waNumber, setWaNumber] = useState<string>('');
    const [otpErr, setOTPErr] = useState<{ status: boolean; message: string }>({
        status: false,
        message: ''
    });
    const [loginErr, setLoginErr] = useState<{
        status: boolean;
        message: string;
    }>({
        status: false,
        message: ''
    });

    const SendOTP = async (e: FormEvent<HTMLFormElement>) => {
        interface Data extends EventTarget {
            wa: HTMLInputElement;
        }
        e.preventDefault();
        const ev: Data = e.target as Data;
        const waNumber = ev.wa.value;
        const validate = (data: string): boolean => {
            if (
                data === '' ||
                !Number(data) ||
                data.length < 9 ||
                data.length > 20
            ) {
                return false;
            } else return true;
        };
        if (!validate(waNumber)) {
            ev.wa.focus();
        } else {
            setLoad(true);
            const otpCode: O['IsOTPCode'] | false = (await sendOTPCode(
                {
                    wa_number: waNumber,
                    created_at: Date.now().toString(),
                    expired_at: (Date.now() + 1000 * 60 * 60).toString()
                },
                { path: 'send_otp', method: 'POST' }
            )) as O['IsOTPCode'];
            if (otpCode) {
                if (otpCode?.status) {
                    setLoad(false);
                    setWaNumber(waNumber);
                    setFormHidden(false);
                } else {
                    setLoad(false);
                    setOTPErr({
                        status: true,
                        message: otpCode?.message
                    });
                }
            } else {
                setLoad(false);
                setOTPErr({
                    status: true,
                    message: 'Something went wrong!'
                });
            }
        }
    };

    const Login = async (e: FormEvent<HTMLFormElement>) => {
        interface Data extends EventTarget {
            otp: HTMLInputElement;
        }
        e.preventDefault();
        const ev: Data = e.target as Data;
        const OTP = ev.otp.value;
        const validate = (data: string): boolean => {
            return data === '' ||
                !Number(data) ||
                data.length < 6 ||
                data.length > 6
                ? false
                : true;
        };
        if (!validate(OTP)) {
            ev.otp.focus();
        } else {
            setLoad(true);
            try {
                const res = await signIn('credentials', {
                    redirect: false,
                    wa_number: waNumber,
                    OTP,
                    timestamp: Date.now(),
                    callbackUrl
                });
                if (!res?.error) {
                    setLoad(false);
                    push(callbackUrl);
                } else {
                    if (res.status === 401) {
                        setLoad(false);
                        setLoginErr({
                            status: true,
                            message: 'OTP is not valid'
                        });
                    }
                }
            } catch (err) {
                setLoad(false);
                setLoginErr({
                    status: true,
                    message: 'Something went wrong!'
                });
            }
        }
    };

    const InputChangeValidate = (e: ChangeEvent<HTMLInputElement>) => {
        const data = e.target.value;

        if (e.target.className.startsWith('wa')) {
            if (!Number(data)) setLabelWaNumber('Enter number only');
            if (data.length < 9) setLabelWaNumber('Enter at least 9 digits');
            if (data.length > 20) setLabelWaNumber('Limit 20 numbers');
            if (
                data === '' ||
                (data.length >= 9 && data.length < 21 && Number(data))
            )
                setLabelWaNumber('Enter your WhatsApp number');
        } else {
            if (!Number(data)) setLabelOTP('Enter number only');
            if (data.length < 6) setLabelOTP('Enter 6 digits of OTP code');
            if (data.length > 6) setLabelOTP('Only 6 digits');
            if (data === '' || (data.length === 6 && Number(data)))
                setLabelOTP('Enter your OTP code');
        }
    };

    return (
        <>
            <Head>
                <title>{load ? 'Loading...' : 'VB CHAT | Log In'}</title>
            </Head>
            <div className='w-full mt-2 p-4 flex flex-col items-center'>
                <h1 className='flex items-center gap-2 text-2xl font-bold text-zinc-300 text-center'>
                    <FaUserLock /> Login
                </h1>
                <p
                    className={`mt-3 text-base font-normal text-center ${
                        formHidden
                            ? otpErr.status
                                ? 'text-red-500'
                                : 'text-zinc-400'
                            : loginErr.status
                            ? 'text-red-500'
                            : 'text-zinc-400'
                    }`}
                >
                    {formHidden
                        ? otpErr.status
                            ? otpErr.message
                            : 'Enter your WhatsApp Number'
                        : loginErr.status
                        ? loginErr.message
                        : 'Verify your OTP code below'}
                </p>
            </div>
            <form
                onSubmit={SendOTP}
                className={`${
                    formHidden ? 'flex' : 'hidden'
                } p-4 w-full flex-col gap-4`}
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
                    onDisabling={load}
                    type='submit'
                    onLoading={load}
                    loadingText='Sending OTP...'
                >
                    Send OTP
                </AuthButton>
            </form>
            <form
                onSubmit={Login}
                className={`${
                    formHidden ? 'hidden' : 'flex'
                } p-4 w-full flex-col sm:flex-row items-center gap-4 mb-3`}
            >
                <div className='w-full flex flex-col gap-1'>
                    <AuthInput
                        identifier='otp'
                        type='text'
                        onChanging={InputChangeValidate}
                        maxs={6}
                    />
                    <AuthLabel forInput='otp'>{labelOTP}</AuthLabel>
                </div>
                <AuthButton
                    onDisabling={load}
                    type='submit'
                    onLoading={load}
                    loadingText='Verifying OTP...'
                    isVerify='yes'
                >
                    Verify OTP
                </AuthButton>
            </form>
            {formHidden && (
                <p className='px-4 text-center w-full text-zinc-400 text-base mt-2 mb-7 font-normal flex justify-center gap-1'>
                    Don&apos; t have an account?{' '}
                    <Link
                        href='/signup'
                        className='text-zinc-200 font-medium cursor-pointer visited:underline'
                    >
                        Sign Up
                    </Link>
                </p>
            )}
        </>
    );
}
