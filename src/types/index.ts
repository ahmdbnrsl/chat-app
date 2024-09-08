import { Document } from 'mongoose';
import { MouseEvent, ChangeEvent } from 'react';

export interface MessageQuoted {
    message_text: string;
    from_name: string;
    message_id: string;
}

export interface Message extends Document {
    message_id: string;
    sender_id: string;
    receiver_id: string;
    message_text: string;
    message_timestamp: string;
    is_readed: boolean;
    read_at?: string;
    message_quoted?: MessageQuoted;
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
    unReadedMessageLength: number;
}

export interface GroupedMessage {
    message_text: string;
    message_id: string;
    message_timestamp: string;
    _id: string;
    is_readed: boolean;
    read_at?: string;
    message_quoted?: MessageQuoted;
}

export interface SenderGroup {
    sender_id: string;
    messages: GroupedMessage[];
}

export interface DateGroup {
    date: string;
    messages: SenderGroup[];
}

export type ID = string;

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
        is_readed: boolean;
        message_quoted?: MessageQuoted;
        message_id?: string;
        secret?: string;
    };
    DeleteMessage: {
        message_id: string;
        secret?: string;
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
        result?: OTP;
    };
    IsStoreOTPCode: {
        status: boolean;
        message: string;
        result?: OTP;
    };
    IsAuthOTPCode: {
        user?: User | null;
        status: boolean;
        message: string;
    };
}

export interface FetchOptions {
    path: string;
    method: string;
    cache?: RequestCache;
    tag?: string;
}

export interface ResultFetcher {
    status: boolean;
    message: string;
    result?:
        | Array<Message>
        | Array<SenderMessage>
        | User
        | OTP
        | Array<DateGroup>;
}

export interface RevalidateBodyRequest {
    tag: string;
    secret: string;
}

export type BodyOptions =
    | U['GetUserInfo']
    | U['Signup']
    | U['EditUser']
    | M['GetListMessage']
    | M['SendMessage']
    | M['DeleteMessage']
    | M['GetListSender']
    | O['SendOTPCode'];

// COMPONENTS PROPS TYPES

export type AuthButtonProps = {
    children: React.ReactNode;
    onDisabling: boolean;
    type: 'submit' | 'reset' | 'button' | undefined;
    onLoading: boolean;
    loadingText: string;
    onClicking?: (e: MouseEvent<HTMLButtonElement>) => void;
    isVerify?: string;
};

export type AuthInputProps = {
    identifier: string;
    type: 'text' | 'password' | 'email' | 'number' | 'file' | undefined;
    maxs: number;
    onChanging?: (e: ChangeEvent<HTMLInputElement>) => void;
};

export type BubleProps = {
    profileName: string;
    key: number;
    buble: GroupedMessage;
    isFromMe: boolean;
};

export type DropdownProps = {
    isOpen: boolean;
    positionTop: string;
    buble: GroupedMessage;
    profileName: string;
    isFromMe: boolean;
};

export type DropDownBtnProps = {
    onClicking: () => void;
    children: React.ReactNode;
    isDisabled?: boolean;
};

// STATE TYPES

export interface MessageQuotedState {
    quotedInfo: MessageQuoted | null;
    add: (isQuoted: MessageQuoted) => void;
    reset: () => void;
}

export interface SearchMessageState {
    searchMessValue: string;
    setSearchMessValue: (mess: string) => void;
    reset: () => void;
}
