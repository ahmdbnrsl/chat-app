'use client';
import Avatar from 'react-avatar';
import Image from 'next/image';
import Link from 'next/link';
import { FaPen, FaArrowLeft } from 'react-icons/fa6';
import { IoCopyOutline } from 'react-icons/io5';
import { useSession } from 'next-auth/react';
import { useState, useEffect, ChangeEvent } from 'react';

export default function EditFormPage() {
    const { data: session, status }: { data: any; status: string } =
        useSession();
    const [labelName, setLabelName] = useState<string>('Edit your fullname');
    const [message, setMessage] = useState<string>(
        'You can edit profile photo and your fullname'
    );
    const [IMGUrl, setIMGUrl] = useState<string>('');
    const [isDisable, setIsDisable] = useState<boolean>(true);

    const InputChangeValidate = (e: ChangeEvent<HTMLInputElement>) => {
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
            setLabelName('Edit your fullname');
        if (data !== session?.user?.name) {
            setIsDisable(false);
        } else {
            setIsDisable(true);
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            const fileName = file.name;
            const validExtensions = ['jpg', 'jpeg', 'png'];
            const fileExtension = fileName.split('.').pop()?.toLowerCase();

            if (!fileExtension || !validExtensions.includes(fileExtension)) {
                setMessage('Only .jpg and .png files are allowed.');
                e.target.value = '';
                return;
            }

            const img = new Image();
            img.src = URL.createObjectURL(file);

            img.onload = () => {
                const width = img.width;
                const height = img.height;

                if (width !== height) {
                    setMessage('Only 1:1 ratio images are allowed.');
                    e.target.value = '';
                } else {
                    setMessage('Image is valid.');
                    setIMGUrl(img.src);
                }

                URL.revokeObjectURL(img.src);
            };
        }
    };
    return (
        <div className='w-full max-w-md bg-zinc-900 rounded-xl shadow shadow-xl shadow-zinc-950 flex flex-col border-2 border-zinc-800'>
            <div className='w-full p-4 flex mt-2'>
                <Link
                    href='/chat/profile'
                    className='text-xl text-zinc-400'
                >
                    <FaArrowLeft />
                </Link>
            </div>
            <div className='w-full p-4 flex flex-col items-center mt-2'>
                <div className='flex items-center gap-2 text-2xl font-bold text-zinc-300 text-center'>
                    <FaPen /> <h1>Edit Profile</h1>
                </div>
                <p className='mt-3 text-base font-normal text-center text-zinc-400'>
                    {message}
                </p>
            </div>
            <form className='p-4 w-full flex flex-col gap-4'>
                <div className='w-full flex flex-col items-start'>
                    <label
                        htmlFor='photo'
                        className='w-full relative flex justify-center items-center'
                    >
                        {session?.user?.pp && session?.user?.pp === 'empety' ? (
                            <>
                                <Avatar
                                    size='125'
                                    name={session?.user?.name}
                                    round={true}
                                />
                                <Image
                                    src={`${IMGUrl || '/icon_asset/00_1.png'}`}
                                    alt='icon'
                                    width={125}
                                    height={125}
                                    loading='lazy'
                                    className='rounded-full border border-zinc-700 absolute z-[99999] bg-zinc-800/[0.3]'
                                />
                            </>
                        ) : (
                            <>
                                <Image
                                    src={session?.user?.pp}
                                    alt={session?.user?.name}
                                    width={125}
                                    height={125}
                                    loading='lazy'
                                    className='rounded-full border border-zinc-700'
                                />
                                <Image
                                    src={`${IMGUrl || '/icon_asset/00_1.png'}`}
                                    alt='icon'
                                    width={125}
                                    height={125}
                                    loading='lazy'
                                    className='rounded-full border border-zinc-700 absolute z-[99999] bg-zinc-800/[0.3]'
                                />
                            </>
                        )}
                    </label>
                    <input
                        onChange={handleFileChange}
                        type='file'
                        accept='.jpg, .png, .jpeg'
                        className='hidden'
                        id='photo'
                    />
                </div>
            </form>
            <form className='p-4 w-full flex flex-col gap-4 mb-4'>
                <div className='bg-zinc-800 w-full py-2 px-3 rounded-xl text-lg font-normal text-zinc-500 flex flex-col justify-center items-center'>
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
                    <input
                        onChange={InputChangeValidate}
                        type='text'
                        id='name'
                        name='name'
                        maxLength={25}
                        placeholder='...'
                        className='name peer w-full bg-zinc-900 outline-0 text-lg font-normal text-zinc-200 tracking-wider rounded-xl px-4 py-2 border-4 border-zinc-600 placeholder:text-transparent focus:border-zinc-400 cursor-text'
                    />
                    <label
                        htmlFor='name'
                        className='absolute -translate-y-3 peer-placeholder-shown:translate-y-3 ml-3 text-sm font-normal text-zinc-500 peer-focus:-translate-y-3 bg-zinc-900 w-auto px-2 py-1 peer-focus:text-zinc-300'
                    >
                        {labelName}
                    </label>
                </div>
                <button
                    disabled={isDisable}
                    type='submit'
                    className={`${
                        isDisable
                            ? 'bg-zinc-800 text-zinc-500'
                            : 'bg-gradient-to-br from-zinc-200 to-zinc-400 text-zinc-950'
                    } flex gap-2 justify-center items-center py-2 mt-2 w-full cursor-pointer text-lg rounded-xl outline-0 font-medium`}
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
}
