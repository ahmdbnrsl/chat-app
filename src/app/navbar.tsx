import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function Navbar() {
    const pathName = usePathname();
    const { data: session, status }: { data: any; status: string } =
        useSession();
    return (
        <nav className='flex justify-between bg-gray-800 py-5 px-5'>
            <h1 className='text-white'>Navbar</h1>
            <ul className='flex ml-5'>
                <Link href='/'>
                    <li
                        className={`mr-3 ${
                            pathName === '/' ? 'text-blue-300' : 'text-white'
                        } cursor-pointer`}
                    >
                        Home
                    </li>
                </Link>
                <Link href='/about'>
                    <li
                        className={`mr-3 ${
                            pathName === '/about'
                                ? 'text-blue-300'
                                : 'text-white'
                        } cursor-pointer`}
                    >
                        About
                    </li>
                </Link>
                <Link href='/about/profile'>
                    <li
                        className={`mr-3 ${
                            pathName === '/about/profile'
                                ? 'text-blue-300'
                                : 'text-white'
                        } cursor-pointer`}
                    >
                        Profile
                    </li>
                </Link>
            </ul>
            {status === 'authenticated' ? (
                <div className='flex gap-3 justify-center items-center'>
                    <Image
                        className='rounded-full w-10 h-10'
                        src='/profile/profile.png'
                        alt='profile'
                        width={200}
                        height={400}
                    />
                    <h4 className='text-white'>{session?.user?.name}</h4>
                    <button
                        className='cursor-pointer bg-white text-gray-800 px-5 py-2 rounded hover:bg-gray-100 hover:border hover:border-gray-400 active:border active:border-gray-400'
                        onClick={() => {
                            signOut();
                        }}
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <button
                    className='cursor-pointer bg-white text-gray-800 px-5 py-2 rounded hover:bg-gray-100 hover:border hover:border-gray-400 active:border active:border-gray-400'
                    onClick={() => {
                        signIn();
                    }}
                >
                    Login
                </button>
            )}
        </nav>
    );
}
