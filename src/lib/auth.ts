import { NextAuthOptions, User as NextAuthUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authOTP } from '@/controller/otps/otp_auth';
import type { User } from '@/types';

interface Result {
    user?: User | null;
    status: boolean;
    message: string;
}

declare module 'next-auth' {
    interface Session {
        user: {
            name?: string | null;
            wa_number?: string | null;
            user_id?: string | null;
            role?: string | null;
            created_at?: string | null;
            update_at?: string | null;
            pp?: string | null;
        };
    }
}

export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXT_PUBLIC_SECRET,
    providers: [
        CredentialsProvider({
            type: 'credentials',
            name: 'credentials',
            credentials: {
                wa_number: {
                    label: 'wa_number',
                    type: 'text'
                },
                OTP: {
                    label: 'OTP',
                    type: 'password'
                },
                timestamp: {
                    label: 'timestamp',
                    type: 'text'
                }
            },
            async authorize(credentials) {
                const { wa_number, OTP, timestamp } = credentials as {
                    wa_number: string;
                    OTP: string;
                    timestamp: string;
                };
                const user: Result | false = await authOTP({
                    wa_number,
                    otp_code: OTP,
                    timestamp
                });
                if (user) {
                    if (user.status && user.user) {
                        let isUser = user.user as NextAuthUser;
                        isUser.id = user.user.user_id;
                        return isUser;
                    } else {
                        return null;
                    }
                } else {
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, account, profile, user, trigger, session }: any) {
            if (account?.provider === 'credentials') {
                token.name = user.name;
                token.wa_number = user.wa_number;
                token.user_id = user.user_id;
                token.role = user.role;
                token.created_at = user.created_at;
                token.update_at = user.update_at;
                token.pp = user.pp;
            }
            if (
                trigger === 'update' &&
                session?.user?.name &&
                session?.user?.pp
            ) {
                token.name = session.user.name;
                token.pp = session.user.pp;
            }
            return token;
        },

        async session({ session, token }: any) {
            if ('name' in token) {
                session.user.name = token.name;
            }
            if ('wa_number' in token) {
                session.user.wa_number = token.wa_number;
            }
            if ('user_id' in token) {
                session.user.user_id = token.user_id;
            }
            if ('role' in token) {
                session.user.role = token.role;
            }
            if ('created_at' in token) {
                session.user.created_at = token.created_at;
            }
            if ('update_at' in token) {
                session.user.update_at = token.update_at;
            }
            if ('pp' in token) {
                session.user.pp = token.pp;
            }
            return session;
        }
    },
    pages: {
        signIn: '/login'
    }
};
