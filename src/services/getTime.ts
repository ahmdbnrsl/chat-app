'use client';

export const date = (isDate: string): string => {
    const date: Date = new Date(Number(isDate));

    return `${String(date.getDate()).padStart(2, '0')}/${String(
        date.getMonth() + 1
    ).padStart(2, '0')}/${date.getFullYear()}`;
};

export const hour = (isDate: string): string => {
    const date: Date = new Date(Number(isDate));
    return `${String(date.getHours()).padStart(2, '0')}:${String(
        date.getMinutes()
    ).padStart(2, '0')}`;
};
