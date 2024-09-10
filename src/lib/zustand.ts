import { create } from 'zustand';
import type {
    MessageQuoted,
    MessageQuotedState,
    SearchMessageState,
    SearchSenderState
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
