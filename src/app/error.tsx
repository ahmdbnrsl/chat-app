'use client';
export default function Error() {
    return (
        <div className='h-screen w-screen bg-white p-6 flex justify-center items-center'>
            <h1 className='text-black text-xs font-normal font-sans'>
                Application error: a client-side exception has occurred (see the
                browser console for more information).
            </h1>
        </div>
    );
}
