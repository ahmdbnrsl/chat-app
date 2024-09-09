import {
    NextMiddleware,
    NextRequest,
    NextFetchEvent,
    NextResponse
} from 'next/server';
import { getToken } from 'next-auth/jwt';

const onlyAdminPage: Array<string> = ['/dashboard'];
const authPage: Array<string> = ['/login', '/signup'];
const APIRequireBearer: Array<string> = [
    '/api/register',
    '/api/send_otp',
    '/api/update_profile',
    '/api/get_list_sender',
    '/api/get_messages',
    '/api/get_user_info',
    '/api/push_message',
    '/api/delete_message',
    '/api/revalidate',
    '/api/read_message'
];

export default function withAuthandValid(
    middleware: NextMiddleware,
    requireAuth: string[] = []
) {
    return async (req: NextRequest, next: NextFetchEvent) => {
        const pathName = req.nextUrl.pathname;
        const match = pathName.match(/^\/chat\/user_id\/([^\/]+)$/);
        const token = await getToken({
            req,
            secret: process.env.NEXT_PUBLIC_SECRET
        });

        if (!token && !authPage.includes(pathName)) {
            if (requireAuth.includes(pathName)) {
                const url = new URL('/login', req.url);
                url.searchParams.set('callbackUrl', encodeURI(req.url));
                return NextResponse.redirect(url);
            }
        }

        if (token) {
            if (requireAuth.includes(pathName)) {
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
            if (match) {
                const user_id = match[1];
                const options: RequestInit = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization:
                            'Bearer ' + process.env.NEXT_PUBLIC_BEARER
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
                const user = await checkExistingUser.json();
                if (!checkExistingUser?.ok) {
                    return NextResponse.redirect(new URL('/chat', req.url));
                } else if (
                    user &&
                    user?.status &&
                    user?.result?.user_id === token.user_id
                ) {
                    return NextResponse.redirect(new URL('/chat', req.url));
                }
            }
        }

        if (APIRequireBearer.includes(pathName)) {
            const authHeader = req.headers.get('Authorization');

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return new NextResponse('Unauthorized', { status: 401 });
            }

            const token = authHeader.split(' ')[1];
            const isValidToken = token === process.env.NEXT_PUBLIC_BEARER;

            if (!isValidToken) {
                return new NextResponse('Unauthorized', { status: 401 });
            }
        }
        return middleware(req, next);
    };
}
