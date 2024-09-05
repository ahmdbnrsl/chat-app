'use client';
export const getHighlightedText = (text: string, highlight: string) => {
    if (!highlight.trim()) {
        return text;
    }
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return (
        <>
            {parts.map((part, index) =>
                regex.test(part) ? (
                    <span
                        key={index}
                        className='bg-zinc-300 text-zinc-900'
                    >
                        {part}
                    </span>
                ) : (
                    part
                )
            )}
        </>
    );
};
