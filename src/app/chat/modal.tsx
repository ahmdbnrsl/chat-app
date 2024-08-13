import Avatar from 'react-avatar';
import Image from 'next/image';
import { FaPen } from 'react-icons/fa6';
import { useState } from 'react';
import { signOut } from 'next-auth/react';
import Loading from '@/components/loading';

export default function Modal({
    name,
    wa_number,
    created_at,
    pp
}: {
    name: string;
    wa_number: string;
    created_at: string;
    pp: string;
}) {
    const [load, setLoad] = useState<boolean>(false);
    const HandleLogout = () => {
        setLoad(true);
        setTimeout(() => {
            signOut();
            setLoad(false);
        }, 2000);
    };
    return (
        <div className='w-full max-w-sm rounded-xl bg-zinc-900 p-7 flex  justify-end relative'>
            <button className='text-zinc-400 outline-0 bg-zinc-800/[0.75] rounded-lg p-2 hover:bg-zinc-800/[0.40] absolute text-base sm:text-lg md:text-xl'>
                <FaPen />
            </button>
            <div className='w-full flex flex-col items-center'>
                {pp === 'empety' ? (
                    <Avatar
                        name={name}
                        size='125'
                        round={true}
                    />
                ) : (
                    <Image
                        alt='profile photo'
                        width={125}
                        height={125}
                        loading='lazy'
                        className='rounded-full'
                    />
                )}
                <h1 className='mt-3 text-xl sm:text-2xl md:text-3xl text-zinc-300 text-center font-bold'>
                    {name}
                </h1>
                <p className='text-xs sm:text-sm md:text-base text-zinc-400 font-normal'>
                    @6288216018165
                </p>
                <p className='text-xs sm:text-sm text-zinc-500 font-normal'>
                    Created at : {created_at}
                </p>
                <button
                    onClick={HandleLogout}
                    disabled={load ? true : false}
                    type='submit'
                    className={`mt-3 flex gap-2 justify-center items-center py-2 mt-2 w-full cursor-pointer ${
                        load
                            ? 'bg-zinc-800 text-zinc-500'
                            : 'bg-gradient-to-br from-zinc-200 to-zinc-400 text-zinc-950'
                    } text-lg rounded-xl outline-0 font-medium`}
                >
                    {load ? (
                        <>
                            <Loading /> {'Logging out...'}
                        </>
                    ) : (
                        'Logout'
                    )}
                </button>
            </div>
        </div>
    );
}
