'use client';

export const date = (isDate: string): string => {
    const date: Date = new Date(Number(isDate));
    const monthNames: string[] = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];
    const monthName: string = monthNames[date.getMonth()];
    return `${date.getFullYear()} ${monthName} ${String(
        date.getDate()
    ).padStart(2, '0')}`;
};

export const hour = (isDate: string): string => {
    const date: Date = new Date(Number(isDate));
    return `${String(date.getHours()).padStart(2, '0')}:${String(
        date.getMinutes()
    ).padStart(2, '0')}`;
};
