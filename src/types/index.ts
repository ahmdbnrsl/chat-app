import { Document } from 'mongoose';

export interface Message extends Document {
    message_id: string;
    sender_id: string;
    receiver_id: string;
    message_text: string;
    message_timestamp: string;
}

export interface User extends Document {
    user_id: string;
    wa_number: string;
    name: string;
    created_at: string;
    update_at: string;
    role: string;
    pp: string;
}

export interface OTP extends Document {
    wa_number: string;
    otp_code: string;
    created_at: string;
    expired_at: string;
}

export interface SenderMessage {
    pp: string;
    name: string;
    wa_number: string;
    fromMe: boolean;
    latestMessageText: string;
    latestMessageTimestamp: string;
    id_user: string;
}

export interface M {
    GetListSender: {
        user_id: string;
        secret?: string;
    };
    GetListMessage: {
        sender_id: string;
        receiver_id: string;
        secret?: string;
    };
    SendMessage: {
        sender_id: string | undefined;
        receiver_id: string | undefined;
        message_text: string;
        message_timestamp: string;
        secret?: string;
    };
    DeleteMessage: {
        message_id: string;
        secret?: string;
    };
    FetchOptions: {
        path: string;
        method: string;
    };
    ListMessage: {
        status: boolean;
        message: string;
        result?: Array<Message>;
    };
    ListSender: {
        status: boolean;
        message: string;
        result?: Array<SenderMessage>;
    };
    ResultMessageService: {
        status: boolean;
        message: string;
        result?: Array<Message> | Array<SenderMessage>;
    };
    IsMessage: {
        status: boolean;
        message: string;
        result?: Message;
    };
}

export interface U {
    Signup: {
        wa_number: string;
        name: string;
        created_at: string;
        secret?: string;
    };
    EditUser: {
        user_id: string;
        new_name?: string;
        new_pp?: string;
        update_at: string;
        secret?: string;
    };
    GetUserInfo: {
        user_id?: string;
        wa_number?: string;
        secret?: string;
    };
    FetchOptions: {
        path: string;
        method: string;
    };
    UserInfo: {
        status: boolean;
        message: string;
        result?: User;
    };
}

export interface O {
    SendOTPCode: {
        wa_number: string;
        created_at: string;
        expired_at: string;
        secret?: string;
    };
    AuthOTPCode: {
        wa_number: string;
        otp_code: string;
        timestamp: string;
    };
    StoreOTPCode: {
        wa_number: string;
        otp_code: string;
        created_at: string;
        expired_at: string;
    };
    IsOTPCode: {
        status: boolean;
        message: string;
    };
    IsAuthOTPCode: {
        user?: User | null;
        status: boolean;
        message: string;
    };
    IsStoreOTPCode: {
        result?: OTP;
        status: boolean;
        message?: string;
    };
}
