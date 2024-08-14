'use client';
import { useRef, ReactNode, MouseEventHandler } from 'react';
import { useRouter } from 'next/navigation';

export default function DekstopView(props: any) {
    const overlay = useRef(null);
    const router = useRouter();
    const { params } = props;

    const close: MouseEventHandler = e => {
        if (e.target === overlay.current) {
            router.back();
        }
    };
    return (
        <div
            ref={overlay}
            className='fixed z-10 left-0 right-0 top-0 bottom-0 mx-auto bg-black/60'
            onClick={close}
        >
            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 bg-white rounded-lg text-black'>
                <h1> chat with : {params.id}</h1>
            </div>
        </div>
    );
}
