import {
    NextMiddleware,
    NextRequest,
    NextFetchEvent,
    NextResponse
} from 'next/server';
import { getToken } from 'next-auth/jwt';

const onlyAdminPage: Array<string> = ['/dashboard'];
const authPage: Array<string> = ['/login', '/signup'];

export default function withAuth(
    middleware: NextMiddleware,
    requireAuth: string[] = []
) {
    return async (req: NextRequest, next: NextFetchEvent) => {
        const pathName = req.nextUrl.pathname;
        if (requireAuth.includes(pathName)) {
            const token = await getToken({
                req,
                secret: process.env.NEXT_PUBLIC_SECRET
            });
            if (!token && !authPage.includes(pathName)) {
                const url = new URL('/login', req.url);
                url.searchParams.set('callbackUrl', encodeURI(req.url));
                return NextResponse.redirect(url);
            }

            if (token) {
                if (authPage.includes(pathName)) {
                    return NextResponse.redirect(new URL('/chat', req.url));
                }
                if (
                    token.role !== 'admin' &&
                    onlyAdminPage.includes(pathName)
                ) {
                    return NextResponse.redirect(new URL('/chat', req.url));
                }
            }
        }
        return middleware(req, next);
    };
}
