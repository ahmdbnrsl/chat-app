import {
    NextMiddleware,
    NextRequest,
    NextFetchEvent,
    NextResponse
} from 'next/server';
import { getToken } from 'next-auth/jwt';

let mongoose;
let user;

const URI: string = process.env.NEXT_PUBLIC_MONGODB_URI || '';

if (typeof window === 'undefined') {
    mongoose = require('mongoose');
    const { users } = require('.././models/users');
    user = users;
}

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
        const match = pathname.match(/^\/chat\/user_id\/([^\/]+)$/);
        if (match) {
            if (mongoose && user) {
                try {
                    await mongoose.connect(URI);
                    const user_id = match[1];
                    const checkExistingUser = await user.findOne({
                        user_id
                    });
                    if (!checkExistingUser) {
                        return NextResponse.redirect(new URL('/chat', req.url));
                    }
                } finally {
                    await mongoose.connection.close();
                }
            }
        }
        return middleware(req, next);
    };
}
