import Link from 'next/link';
export default function DashboardLayout({
    children
}: {
    children: React.ReactNode;
}) {
    const dashboardRoute: { path: string; name: string }[] = [
        { path: '/dashboard', name: 'Users' },
        { path: '/dashboard/sendcustommessage', name: 'Custom Message' },
        { path: '/dashboard/sendcarrousel', name: 'Carrousel Message' },
        { path: '/dashboard/listgroup', name: 'List Group' }
    ];
    return (
        <main className='w-full min-h-screen bg-zinc-950'>
            <nav className='w-full p-3 flex flex-wrap gap-3'>
                {dashboardRoute.map(
                    (item: { path: string; name: string }, i: number) => (
                        <Link
                            key={i}
                            href={item.path}
                            className='px-4 py-1 rounded-lg bg-zinc-900/[0.5] text-zinc-400 text-base font-medium hover:bg-zinc-900 hover:text-zinc-200'
                        >
                            {item.name}
                        </Link>
                    )
                )}
            </nav>
            <section className='p-6 w-full flex flex-col items-center'>
                {children}
            </section>
        </main>
    );
}
