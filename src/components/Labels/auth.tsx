export default function AuthLabel({
    forInput,
    children
}: {
    forInput: string;
    children: React.ReactNode;
}) {
    return (
        <label
            htmlFor={forInput}
            className='absolute -translate-y-3 peer-placeholder-shown:translate-y-3 ml-3 text-sm font-normal text-zinc-500 peer-focus:-translate-y-3 bg-zinc-900 w-auto px-2 py-1 peer-focus:text-zinc-300'
        >
            {children}
        </label>
    );
}
