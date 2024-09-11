'use client';

export default function AIChat() {
    return (
        <Link
            href='/chat/ai'
            className='w-full rounded-xl transition-colors hover:bg-zinc-900/[0.85] flex justify-between items-center p-3 cursor-pointer'
        >
            <div className='w-8/12 flex gap-3 items-center'>
                <div className='w-[50px] h-[50px] relative flex items-end justify-end'>
                    <Image
                        alt='User profile'
                        src='https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-gemini-icon.png'
                        height={50}
                        width={50}
                        className='rounded-full border border-zinc-700'
                        loading='lazy'
                    />
                </div>
                <div className='flex flex-col'>
                    <h1 className='text-base sm:text-lg text-indigo-400 font-medium'>
                        VB AI
                    </h1>
                    <div className='flex items-center gap-2'>
                        <p className='w-[15ch] sm:w-[25ch] md:w-[50ch] xl:w-[15ch] text-xs sm:text-sm text-zinc-400 truncate'>
                            this is response from ai
                        </p>
                    </div>
                </div>
            </div>
            <div className='w-1/4 flex flex-col justify-center items-end'>
                <p className='text-xs font-normal text-zinc-500'>20/08/2021</p>
            </div>
        </Link>
    );
}
