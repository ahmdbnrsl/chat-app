import {
    NextMiddleware,
    NextRequest,
    NextFetchEvent,
    NextResponse
} from 'next/server';
import { getToken } from 'next-auth/jwt';

const onlyAdminPage: Array<string> = ['/dashboard'];
const authPage: Array<string> = ['/login', '/signup'];

export default function withAuthandValid(
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
        const match = pathName.match(/^\/chat\/user_id\/([^\/]+)$/);
        if (match) {
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
                const user_id = match[1];
                const options: RequestInit = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        user_id,
                        secret: process.env.NEXT_PUBLIC_SECRET
                    }),
                    cache: 'no-store'
                };
                const checkExistingUser: Response = await fetch(
                    process.env.NEXT_PUBLIC_SELF_URL + '/api/get_user_info',
                    options
                );
                if (!checkExistingUser?.ok) {
                    return NextResponse.redirect(new URL('/chat', req.url));
                }
            }
        }
        return middleware(req, next);
    };
}
