import { NextAuthOptions, User as NextAuthUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import NextAuth from 'next-auth/next';
import { authOTP } from '@/services/otps/otp_auth';
import { User } from '@/models/users';

/*interface BodyRequest {
    wa_number: string;
    otp_code: string;
    timestamp: string;
    secret: string;
}*/

interface Result {
    user?: User | null;
    status: boolean;
    message: string;
}

/*export async function POST(req: NextRequest) {
    const body: BodyRequest = await req.json();
    const { secret } = body;
    if (secret !== process.env.NEXT_PUBLIC_SECRET) {
        return NextResponse.json(
            {
                status: false,
                message: 'token is invalid'
            },
            { status: 400 }
        );
    }
    try {
        const res: Result | false = await authOTP(body);
        if (res) {
            if (res?.status) {
                return NextResponse.json(
                    {
                        status: true,
                        message: res?.message
                    },
                    { status: 200 }
                );
            } else {
                return NextResponse.json(
                    {
                        status: false,
                        message: res?.message
                    },
                    { status: 500 }
                );
            }
        } else {
            return NextResponse.json(
                {
                    status: false,
                    message: 'Server error'
                },
                {
                    status: 500
                }
            );
        }
    } catch (error) {
        return NextResponse.json(
            {
                status: false,
                message: 'Server error'
            },
            {
                status: 500
            }
        );
    }
}*/

const authOptions: NextAuthOptions = {
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
                        const {
                            user_id,
                            wa_number,
                            name,
                            created_at,
                            update_at
                        } = user.user;
                        const isUser = {
                            id: user_id,
                            wa_number,
                            name,
                            created_at,
                            update_at
                        } as NextAuthUser;
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
        async jwt({ token, account, profile, user }: any) {
            if (account?.provider === 'credentials') {
                token.name = user.name;
                token.wa_number = user.wa_number;
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

            return session;
        }
    },
    pages: {
        signIn: '/login'
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
