import type {
    Message,
    GroupedMessage,
    DateGroup,
    ID,
    SenderGroup
} from '@/types';

export function groupMessagesByDateAndSender(messages: Message[]): DateGroup[] {
    const grouped: {
        [key: string]: { sender_id: string; messages: GroupedMessage[] }[];
    } = {};

    messages.forEach((message: Message, index: number) => {
        const date = new Date(
            parseInt(message.message_timestamp)
        ).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        if (!grouped[date]) {
            grouped[date] = [];
        }

        const lastGroup = grouped[date][grouped[date].length - 1];

        if (!lastGroup || lastGroup.sender_id !== message.sender_id) {
            grouped[date].push({
                sender_id: message.sender_id,
                messages: [message]
            });
        } else {
            lastGroup.messages.push(message);
        }
    });

    return Object.keys(grouped).map((date: DateGroup) => ({
        date,
        messages: grouped[date].map((group: SenderGroup) => ({
            sender_id: group.sender_id,
            messages: group.messages.map((mess: GroupedMessage) => ({
                message_text: mess.message_text,
                message_id: mess.message_id,
                message_timestamp: mess.message_timestamp,
                message_quoted: mess?.message_quoted,
                is_readed: mess.is_readed,
                read_at: mess?.read_at,
                _id: mess._id
            }))
        }))
    }));
}
