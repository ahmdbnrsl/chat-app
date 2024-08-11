export default function AuthLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className='transition-all w-full min-h-screen bg-zinc-950 bg-ornament bg-[length:500px]'>
            <section className='w-full min-h-screen p-5 flex flex-col justify-center items-center'>
                <div className='w-full max-w-md bg-zinc-900 rounded-xl shadow shadow-xl shadow-zinc-950 flex flex-col border-2 border-zinc-800'>
                    {children}
                </div>
            </section>
        </main>
    );
}
