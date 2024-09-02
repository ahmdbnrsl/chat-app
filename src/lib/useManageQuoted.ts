import { create } from 'zustand';
import type { MessageQuoted, MessageQuotedState } from '@/types';

export const useManageQuoted = create<MessageQuotedState>(set => ({
    quotedInfo: null,
    add: (isQuoted: MessageQuoted) => set({ quotedInfo: isQuoted }),
    reset: () => set({ quotedInfo: null })
}));
