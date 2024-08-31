'use client';
import type { Message, GroupedMessage, DateGroup } from '@/types';

export function groupMessagesByDateAndSender(messages: Message[]): DateGroup[] {
    const groupedByDate = messages.reduce(
        (
            acc: Record<string, Record<string, GroupedMessage[]>>,
            curr: Message
        ) => {
            const date = new Date(
                parseInt(curr.message_timestamp)
            ).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });

            if (!acc[date]) {
                acc[date] = {};
            }

            if (!acc[date][curr.sender_id]) {
                acc[date][curr.sender_id] = [];
            }

            acc[date][curr.sender_id].push({
                message_text: curr.message_text.trim(),
                message_id: curr.message_id,
                message_timestamp: curr.message_timestamp,
                _id: curr._id as ID
            });

            return acc;
        },
        {} as Record<string, Record<string, GroupedMessage[]>>
    );

    const result: DateGroup[] = Object.keys(groupedByDate).map(date => ({
        date,
        messages: Object.keys(groupedByDate[date]).map(sender_id => ({
            sender_id,
            messages: groupedByDate[date][sender_id]
        }))
    }));

    return result;
}
