import { create } from 'zustand';
import type {
    MessageQuoted,
    SenderMessage,
    Message,
    User,
    MessageQuotedState,
    SearchMessageState,
    SearchSenderState,
    SenderNewMessageState
} from '@/types';

export const useManageQuoted = create<MessageQuotedState>(set => ({
    quotedInfo: null,
    add: (isQuoted: MessageQuoted) => set({ quotedInfo: isQuoted }),
    reset: () => set({ quotedInfo: null })
}));

export const useManageSearchMessage = create<SearchMessageState>(set => ({
    searchMessValue: '',
    setSearchMessValue: (mess: string) => set({ searchMessValue: mess }),
    reset: () => set({ searchMessValue: '' })
}));

export const useManageSearchSender = create<SearchSenderState>(set => ({
    searchSenderValue: '',
    setSearchSenderValue: (sender: string) =>
        set({ searchSenderValue: sender }),
    clearSearchSender: () => set({ searchSenderValue: '' })
}));

export const useUpdatedSenderNewMessage = create<SenderNewMessageState>(
    set => ({
        listSender: null,
        setListSender: (senders: SenderMessage[]) =>
            set({ listSender: senders }),
        setNewMessageListSender: (
            newData: Message,
            sessionUserId: string,
            fetchSenderInfo: (user_id: string) => Promise<User | undefined>
        ) =>
            set(state => {
                const prevData = state?.listSender as SenderMessage[];

                const messageIndex = prevData.findIndex(
                    ({ latestMessageSenderId, latestMessageReceiverId }) =>
                        (latestMessageSenderId === newData.sender_id &&
                            latestMessageReceiverId === newData.receiver_id) ||
                        (latestMessageSenderId === newData.receiver_id &&
                            latestMessageReceiverId === newData.sender_id)
                );

                if (messageIndex > -1) {
                    const findNewMessage = prevData[messageIndex];
                    findNewMessage.fromMe = newData.sender_id === sessionUserId;
                    findNewMessage.latestMessageId = newData.message_id;
                    findNewMessage.latestMessageText = newData.message_text;
                    findNewMessage.latestMessageTimestamp =
                        newData.message_timestamp;
                    findNewMessage.latestMessageSenderId = newData.sender_id;
                    findNewMessage.latestMessageReceiverId =
                        newData.receiver_id;
                    findNewMessage.latestMessageIdOnDB = newData._id as string;
                    findNewMessage.is_readed = newData.is_readed;
                    findNewMessage.unReadedMessageLength =
                        newData.sender_id !== sessionUserId
                            ? findNewMessage.unReadedMessageLength + 1
                            : findNewMessage.unReadedMessageLength;
                } else {
                    const newSender =
                        newData.sender_id !== sessionUserId
                            ? newData.sender_id
                            : newData.receiver_id;

                    fetchSenderInfo(newSender).then(senderInfo => {
                        if (senderInfo) {
                            set(state => ({
                                listSender: [
                                    {
                                        pp: senderInfo.pp,
                                        name: senderInfo.name,
                                        wa_number: senderInfo.wa_number,
                                        fromMe:
                                            newData.sender_id === sessionUserId,
                                        latestMessageId: newData.message_id,
                                        latestMessageText: newData.message_text,
                                        latestMessageTimestamp:
                                            newData.message_timestamp,
                                        latestMessageSenderId:
                                            newData.sender_id,
                                        latestMessageReceiverId:
                                            newData.receiver_id,
                                        latestMessageIdOnDB:
                                            newData._id as string,
                                        id_user: newSender,
                                        is_readed: newData.is_readed,
                                        unReadedMessageLength:
                                            newData.sender_id !== sessionUserId
                                                ? 1
                                                : 0
                                    },
                                    ...(state?.listSender as SenderMessage[])
                                ]
                            }));
                        }
                    });
                }
                return { listSender: [...prevData] };
            }),
        setReadMessageListSender: (readedMessageId: string) =>
            set(state => {
                const prevData = state?.listSender as SenderMessage[];
                let messageReaded: SenderMessage | undefined = (
                    prevData as SenderMessage[]
                ).find(
                    (sender: SenderMessage) =>
                        sender.latestMessageIdOnDB === readedMessageId
                );
                if (messageReaded) {
                    messageReaded.is_readed = true;
                    messageReaded.unReadedMessageLength = 0;
                }
                return prevData as SenderMessage[];
            })
    })
);
