import NextAuth from 'next-auth/next';
import { authOptions } from '@/lib/auth';

interface Result {
    user?: User | null;
    status: boolean;
    message: string;
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
