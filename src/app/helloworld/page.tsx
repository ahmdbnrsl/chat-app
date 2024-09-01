'use client';
export default function HelloWorld() {
    return (
        <div
            onClick={() => console.log('Hello World!')}
            className='h-screen w-screen bg-white p-6 flex justify-center items-center'
        >
            <h1 className='text-black text-4xl font-bold font-serif'>
                Hello World!
            </h1>
        </div>
    );
}
