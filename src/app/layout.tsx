'use client';
import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

const disableNavbar: Array<string> = ['/login', '/signup', '/chat'];

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathName = usePathname();
    return (
        <html lang='en'>
            <body className={`${inter.className} bg-zinc-950`}>
                <SessionProvider>{children}</SessionProvider>
            </body>
        </html>
    );
}
