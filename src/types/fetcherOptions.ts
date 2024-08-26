import { Message } from '@/models/messages';

export interface M {
    GetListSender: {
        user_id: string;
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
    Result:
        | {
              status: boolean;
              message: string;
              result?:
                  | Array<Message>
                  | Array<{
                        pp: string;
                        name: string;
                        wa_number: string;
                        fromMe: boolean;
                        latestMessageText: string;
                        latestMessageTimestamp: string;
                        id_user: string;
                    }>;
          }
        | false;
}
