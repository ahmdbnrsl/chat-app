export default function EditLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className='transition-all w-full min-h-screen bg-zinc-950 bg-ornament bg-[length:500px]'>
            <section className='w-full min-h-screen p-5 flex flex-col justify-center items-center'>
                {children}
            </section>
        </main>
    );
}
