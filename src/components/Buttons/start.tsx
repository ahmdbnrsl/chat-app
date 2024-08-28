'use client';
export default function StartButton({
    children,
    onClicking
}: {
    children: React.ReactNode;
    onClicking: () => void;
}) {
    return (
        <button
            onClick={onClicking}
            type='button'
            className='bg-zinc-200 rounded-full py-1.5 px-6 outline-0 text-zinc-950 text-center cursor-pointer hover:scale-[1.025] transition-transform'
        >
            {children}
        </button>
    );
}
