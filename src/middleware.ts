import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import withAuthandValid from './middlewares/withAuthandValid';

export function mainMiddleware(request: NextRequest) {
    const res = NextResponse.next();
    return res;
}

export default withAuthandValid(mainMiddleware, [
    '/chat',
    '/dashboard',
    '/login',
    '/signup',
    '/chat/profile',
    '/chat/profile/edit',
    '/chat/user_id',
    '/chat/ai'
]);
