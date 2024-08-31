import Loading from '@/components/loading';
import { FaPaperPlane } from 'react-icons/fa';

export default function CircleButton({
    isLoad,
    isDisabled
}: {
    isLoad: boolean;
    isDisabled: boolean;
}) {
    return (
        <button
            disabled={isDisabled}
            type='submit'
            className={`flex justify-center items-center p-4  cursor-pointer ${
                isLoad
                    ? 'bg-zinc-800 text-zinc-500 px-5 py-4'
                    : 'bg-gradient-to-br from-zinc-200 to-zinc-400 text-zinc-950'
            } text-lg rounded-full outline-0 font-medium`}
        >
            {isLoad ? <Loading /> : <FaPaperPlane />}
        </button>
    );
}
