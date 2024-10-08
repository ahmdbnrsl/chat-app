'use client';

import Avatar from 'react-avatar';
import Image from 'next/image';
import Link from 'next/link';
import Loading from '@/components/loading';
import { FaPen, FaArrowLeft } from 'react-icons/fa6';
import { IoCopyOutline } from 'react-icons/io5';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { FetcherService as editUser } from '@/services/fetcherService';
import AuthButton from '@/components/Buttons/auth';
import AuthLabel from '@/components/Labels/auth';
import AuthInput from '@/components/Inputs/auth';
import type { U } from '@/types';

export default function EditFormPage({ searchParams }: any) {
    const {
        data: session,
        status,
        update
    }: { data: any; status: string; update: any } = useSession();
    const { push } = useRouter();
    const baseUrl: string =
        process.env.NEXT_PUBLIC_SELF_URL || 'https://vbchat.vercel.app';
    const callbackUrl = encodeURI(
        searchParams.callbackUrl || baseUrl + '/chat'
    );
    const [labelName, setLabelName] = useState<string>('Edit your fullname');
    const [err, setErr] = useState<{ status: boolean; message: string }>({
        status: false,
        message: ''
    });
    const [IMGUrl, setIMGUrl] = useState<string>('');
    const [isDisable, setIsDisable] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [load, setLoad] = useState<boolean>(false);

    const InputChangeValidate = (e: ChangeEvent<HTMLInputElement>) => {
        const data = e.target.value;
        !IMGUrl && data === '' ? setIsDisable(true) : setIsDisable(false);
        data !== session?.user?.name ? setIsDisable(false) : setIsDisable(true);
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
            setLabelName('Edit your fullname');
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            const fileName = file.name;
            const validExtensions = ['jpg', 'jpeg', 'png'];
            const fileExtension = fileName.split('.').pop()?.toLowerCase();

            if (!fileExtension || !validExtensions.includes(fileExtension)) {
                setErr({
                    status: true,
                    message: 'Only .jpg and .png files are allowed.'
                });
                e.target.value = '';
                return;
            }

            const img = document.createElement('img') as HTMLImageElement;
            img.src = URL.createObjectURL(file);

            img.onload = async () => {
                const width = img.width;
                const height = img.height;

                if (width !== height) {
                    setErr({
                        status: true,
                        message: 'Only 1:1 ratio images are allowed.'
                    });
                    e.target.value = '';
                } else {
                    setLoading(true);
                    setIsDisable(true);
                    e.target.disabled = true;
                    setErr({
                        status: false,
                        message: 'You can edit profile photo and your fullname'
                    });
                    const formData = new FormData();
                    formData.append('file', file);
                    try {
                        const response: Response = await fetch('/api/upload', {
                            method: 'POST',
                            body: formData
                        });

                        const result = await response.json();
                        if (response.ok) {
                            setIMGUrl(result.fileUrl);
                            setLoading(false);
                            setIsDisable(false);
                        } else {
                            setErr({
                                status: true,
                                message: `Upload failed: unsupported image or bad connection`
                            });
                            e.target.disabled = false;
                            setLoading(false);
                        }
                    } catch (error) {
                        setErr({ status: true, message: `Server Error` });
                        e.target.disabled = false;
                        setLoading(false);
                    }
                }
                URL.revokeObjectURL(img.src);
            };
        }
    };

    const UpdateProfile = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const ev = e.target as typeof e.target & {
            name: HTMLInputElement;
            photo: HTMLInputElement;
        };
        const validate = (data: string): boolean => {
            return (data !== '' && data.replace(/\s/g, '') === '') ||
                data.length < 5 ||
                data.length > 25
                ? false
                : true;
        };
        if (
            (ev.name.value !== '' && !validate(ev.name.value)) ||
            (ev.name.value === '' && !IMGUrl)
        ) {
            ev.name.focus();
        } else {
            setLoad(true);
            setIsDisable(true);
            ev.name.disabled = true;
            ev.photo.disabled = true;
            const editing: U['UserInfo'] | false = (await editUser(
                {
                    user_id: session?.user?.user_id,
                    new_name: ev.name.value || '',
                    new_pp: IMGUrl || '',
                    update_at: Date.now().toString()
                },
                { path: 'update_profile', method: 'PUT' }
            )) as U['UserInfo'];
            if (editing && editing?.status) {
                const res = await update({
                    user: {
                        name: ev.name.value || session?.user?.name,
                        pp: IMGUrl || session?.user?.pp
                    }
                });
                if (!res?.error) {
                    setLoad(false);
                    push('/chat/profile?callbackUrl=' + callbackUrl);
                } else {
                    if (res.status === 401) {
                        setLoad(false);
                        setErr({
                            status: true,
                            message: 'Failed to revalidate session'
                        });
                        setIsDisable(false);
                        ev.name.disabled = false;
                        ev.photo.disabled = false;
                    }
                }
            } else {
                setLoad(false);
                setErr({ status: true, message: 'Failed to update profile' });
                setIsDisable(false);
                ev.name.disabled = false;
                ev.photo.disabled = false;
            }
        }
    };
    return (
        <div className='w-full sm:max-w-md bg-zinc-900 sm:rounded-xl sm:shadow sm:shadow-xl sm:shadow-zinc-950 flex flex-col sm:border-2 sm:border-zinc-800'>
            <div className='w-full p-4 flex mt-2'>
                <Link
                    href={`/chat/profile?callbackUrl=${callbackUrl}`}
                    className='text-zinc-400 outline-0 bg-zinc-800/[0.75] rounded-lg p-2 hover:bg-zinc-800/[0.40] text-base sm:text-lg md:text-xl cursor-pointer'
                >
                    <FaArrowLeft />
                </Link>
            </div>
            <div className='w-full p-4 flex flex-col items-center mt-2'>
                <div className='flex items-center gap-2 text-2xl font-bold text-zinc-300 text-center'>
                    <FaPen /> <h1>Edit Profile</h1>
                </div>
                <p
                    className={`mt-3 text-base font-normal text-center ${
                        err.status ? 'text-red-500' : 'text-zinc-400'
                    }`}
                >
                    {err.status
                        ? err.message
                        : 'You can edit profile photo and your fullname'}
                </p>
            </div>
            <form
                onSubmit={UpdateProfile}
                className='p-4 w-full flex flex-col gap-4 mb-4'
            >
                <div className='w-full flex flex-col items-start'>
                    <label
                        htmlFor='photo'
                        className='w-full relative flex justify-center items-center'
                    >
                        <div
                            className={`w-[125px] h-[125px] rounded-full bg-zinc-800 border border-zinc-700 cursor-pointer ${
                                loading ? 'opacity-10' : ''
                            }`}
                        >
                            {!IMGUrl &&
                                (session?.user?.pp &&
                                session?.user?.pp !== 'empety' ? (
                                    <Image
                                        src={session?.user?.pp}
                                        alt={session?.user?.name}
                                        width={125}
                                        height={125}
                                        loading='lazy'
                                        className='rounded-full border border-zinc-700'
                                    />
                                ) : (
                                    <Avatar
                                        size='125'
                                        name={session?.user?.name}
                                        round={true}
                                    />
                                ))}
                        </div>
                        <Image
                            src={`${IMGUrl || '/icon_asset/00_1.png'}`}
                            alt='icon'
                            width={125}
                            height={125}
                            loading='lazy'
                            className={`${
                                loading ? 'hidden' : ''
                            } cursor-pointer rounded-full border border-zinc-700 absolute z-[99999] bg-zinc-800/[0.3]`}
                        />
                        {loading ? (
                            <div className='w-auto absolute z-[999999] scale-[3]'>
                                <Loading />
                            </div>
                        ) : (
                            ''
                        )}
                    </label>
                    <input
                        onChange={handleFileChange}
                        type='file'
                        name='photo'
                        accept='.jpg, .png, .jpeg'
                        className='hidden'
                        id='photo'
                    />
                </div>
                <div className='mt-3 bg-zinc-800 w-full py-2 px-3 rounded-xl text-lg font-normal text-zinc-500 flex flex-col justify-center items-center'>
                    <p className='text-base'>Current fullname :</p>
                    <p className='font-medium text-zinc-300 flex items-center gap-2 flex-wrap text-center'>
                        {session?.user?.name
                            ? session?.user?.name
                            : 'Loading...'}{' '}
                        <span
                            className='cursor-pointer hover:text-zinc-500'
                            onClick={() =>
                                window.navigator.clipboard.writeText(
                                    session?.user?.name || ''
                                )
                            }
                        >
                            <IoCopyOutline />
                        </span>
                    </p>
                </div>
                <div className='w-full flex flex-col items-start'>
                    <AuthInput
                        identifier='name'
                        type='text'
                        onChanging={InputChangeValidate}
                        maxs={25}
                    />
                    <AuthLabel forInput='name'>{labelName}</AuthLabel>
                </div>
                <AuthButton
                    onLoading={load}
                    onDisabling={isDisable}
                    type='submit'
                    loadingText='Updating profile...'
                >
                    Save Changes
                </AuthButton>
            </form>
        </div>
    );
}
