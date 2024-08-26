import { Message } from '@/models/messages';
import type { Result } from '@/controller/messages/get_list_sender';

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
    Result: {
        status: boolean;
        message: string;
        result?: Array<Message>;
    };
    Result2: {
        status: boolean;
        message: string;
        result?: Array<Result>;
    };
}
