import IsLoading from '@/components/loading';
export default function Loading() {
    return (
        <main className='bg-zinc-900 w-full min-h-screen flex'>
            <section className='w-full flex flex-col min-h-screen xl:w-1/3'>
                <nav className='sticky top-0 z-20 bg-zinc-900 w-full py-4 px-6 flex flex-col border-b border-zinc-800 items-center'>
                    <div className='flex justify-between w-full items-center'>
                        <h1 className='text-zinc-200 text-lg sm:text-xl font-semibold tracking-normal'>
                            Chats
                        </h1>
                        <button className='p-1.5 text-zinc-300 font-medium text-lg sm:text-xl md:text-2xl outline-0 bg-zinc-700 border-0 rounded-full'></button>
                    </div>
                    <input
                        type='text'
                        placeholder='Search by name'
                        className='mt-2 w-full py-2 px-4 text-zinc-300 font-normal text-base sm:text-lg rounded-lg bg-zinc-800/[0.5] outline-0 border-2 border-zinc-800 focus:border-zinc-700 placeholder:text-zinc-400 placeholder:text-sm sm:placeholder:text-base'
                    />
                </nav>
                <div className='w-full flex flex-col gap-3 p-6 flex-grow items-center'>
                    <div className='w-full flex justify-center gap-2 text-lg font-medium text-zinc-500 items-center'>
                        <IsLoading /> Loading your chats...
                    </div>
                </div>
                <div className='sticky bottom-0 bg-zinc-900 w-full py-4 px-6 flex flex-col border-t border-zinc-800 items-center'>
                    <button className='bg-zinc-200 rounded-full py-1.5 px-6 outline-0 text-zinc-950 text-center'>
                        + Start Chat
                    </button>
                </div>
            </section>
            <section className='hidden min-h-screen xl:flex w-4/6 bg-zinc-950 bg-ornament'></section>
        </main>
    );
}
