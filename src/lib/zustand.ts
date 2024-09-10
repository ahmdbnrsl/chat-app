import { create } from 'zustand';
import type {
    MessageQuoted,
    SenderMessage,
    Message,
    User,
    DateGroup,
    SenderGroup,
    GroupedMessage,
    MessageQuotedState,
    SearchMessageState,
    SearchSenderState,
    SenderNewMessageState,
    UpdatedListMessageState
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
                    prevData.splice(messageIndex, 1);
                    prevData.unshift(findNewMessage);
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
                return { listSender: prevData as SenderMessage[] };
            })
    })
);

export const useUpdatedListMessage = create<UpdatedListMessageState>(set => ({
    listMessage: null,
    setListMessage: (messages: DateGroup[]) => set({ listMessage: messages }),
    setNewUpdatedListMessage: (newData: DateGroup) =>
        set(state => {
            let prevData = state?.listMessage as DateGroup[];

            const newMessageDate = new Date(
                parseInt(newData.message_timestamp)
            ).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });

            let dateGroup: DateGroup | undefined = prevData.find(
                group => group.date === newMessageDate
            );

            if (!dateGroup) {
                dateGroup = {
                    date: newMessageDate,
                    messages: []
                };
                prevData = [...prevData, dateGroup];
            }

            const messagesInDateGroup = dateGroup.messages;

            const lastSenderGroup =
                messagesInDateGroup.length > 0
                    ? messagesInDateGroup[messagesInDateGroup.length - 1]
                    : null;

            if (
                !lastSenderGroup ||
                lastSenderGroup.sender_id !== newData.sender_id
            ) {
                messagesInDateGroup.push({
                    sender_id: newData.sender_id,
                    messages: [
                        {
                            message_text: newData.message_text,
                            message_id: newData.message_id,
                            message_timestamp: newData.message_timestamp,
                            message_quoted: newData?.message_quoted,
                            is_readed: newData?.is_readed,
                            read_at: newData?.read_at,
                            _id: newData._id as string
                        }
                    ]
                });
            } else {
                lastSenderGroup.messages = [
                    ...lastSenderGroup.messages,
                    {
                        message_text: newData.message_text,
                        message_id: newData.message_id,
                        message_timestamp: newData.message_timestamp,
                        message_quoted: newData?.message_quoted,
                        is_readed: newData?.is_readed,
                        read_at: newData?.read_at,
                        _id: newData._id as string
                    }
                ];
            }

            dateGroup.messages.forEach(group => {
                group.messages.sort(
                    (a, b) =>
                        Number(a.message_timestamp) -
                        Number(b.message_timestamp)
                );
            });

            return {
                listMessage: prevData.sort(
                    (a, b) =>
                        new Date(a.date).getTime() - new Date(b.date).getTime()
                )
            };
        }),
    setNewDeletedListMessage: (deletedMessageId: string) =>
        set(state => {
            let prevData = state?.listMessage as DateGroup[];
            const updatedData: DateGroup[] = prevData.map(
                (dateGroup: DateGroup) => {
                    const updatedMessages: SenderGroup[] = dateGroup.messages
                        .map((senderGroup: SenderGroup) => ({
                            ...(senderGroup as SenderGroup),
                            messages: senderGroup.messages.filter(
                                (message: GroupedMessage) =>
                                    message._id !== deletedMessageId
                            )
                        }))
                        .filter(
                            (senderGroup: SenderGroup) =>
                                senderGroup.messages.length > 0
                        );

                    return {
                        ...(dateGroup as DateGroup),
                        messages: updatedMessages
                    };
                }
            );

            return {
                listMessage: updatedData.filter(
                    (dateGroup: DateGroup) => dateGroup.messages.length > 0
                )
            };
        })
}));
