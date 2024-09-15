'use client';
import { FaWhatsapp } from 'react-icons/fa6';
import { sendCarrouselMess } from '@/services/sendWaMessage';
import { useState } from 'react';

function Cards({
    items,
    index,
    btn,
    setBtn
}: {
    items: any;
    index: number;
    btn: any;
    setBtn: any;
}) {
    const HandleTouch = (e: any) => {
        e.preventDefault();
        setBtn(btn + 1);
    };
    return (
        <>
            <p className='px-5 text-slate-300 font-bold text-sm'>
                Card {index + 1}
            </p>
            <input
                className={`send-input cardImage${items}${index}`}
                placeholder='Image Url'
                type='text'
                name={`cardImage${items}${index}`}
            />
            <textarea
                className={`h-24 send-input w-full resize-none cardText${items}${index}`}
                placeholder='card text'
                name={`cardText${items}${index}`}
            ></textarea>
            <div className='send-input-group'>
                {Array(btn)
                    ?.fill(0)
                    ?.map((item: any, indexs: number) => (
                        <div
                            className='send-input-group'
                            key={indexs}
                        >
                            <p className='px-5 text-slate-300 font-bold text-sm'>
                                Button {indexs + 1}
                            </p>
                            <input
                                className={`send-input buttonName${item}${index}${indexs}`}
                                placeholder='Button name'
                                type='text'
                                name={`buttonName${indexs}`}
                            />
                            <textarea
                                className={`h-24 w-full resize-none send-input buttonParams${item}${index}${indexs}`}
                                placeholder='Button params json'
                                name={`buttonParams${indexs}`}
                            ></textarea>
                        </div>
                    ))}
                <button
                    type='button'
                    className='send-btn'
                    onClick={HandleTouch}
                >
                    Add button +
                </button>
            </div>
        </>
    );
}

export default function CarrouselMessage() {
    const [loading, setLoading] = useState<boolean>(false);
    const [opacity, setOpacity] = useState<string>('opacity-100');
    const [isDisable, setIsDisable] = useState<boolean>(false);
    const [errs, setErrs] = useState<boolean>(false);
    const [cards, setCards] = useState<number>(1);
    const [btn, setBtn] = useState<number>(1);
    const HandleSubmit = async (e: any) => {
        e.preventDefault();
        if (e.target.phone.value === '') {
            e.target.phone.focus();
        } else {
            setLoading(true);
            setOpacity('opacity-50');
            setIsDisable(true);
            try {
                const fetching: boolean = await sendCarrouselMess({
                    number: e.target.phone.value,
                    text: e.target.message.value,

                    quoted: JSON.stringify([
                        e.target.participant.value,
                        e.target.quoted.value
                    ]),
                    cards: Array(cards)
                        .fill(0)
                        .map((items: any, index: number) => {
                            return {
                                imgurl: (
                                    document.querySelector(
                                        `.cardImage${items}${index}`
                                    ) as HTMLInputElement
                                )?.value,
                                text: (
                                    document.querySelector(
                                        `.cardText${items}${index}`
                                    ) as HTMLTextAreaElement
                                )?.value,
                                btn: Array(btn)
                                    .fill(0)
                                    .map((item: any, indexs: number) => {
                                        return {
                                            name: (
                                                document.querySelector(
                                                    `.buttonName${item}${index}${indexs}`
                                                ) as HTMLInputElement
                                            )?.value,
                                            buttonParamsJson: (
                                                document.querySelector(
                                                    `.buttonParams${item}${index}${indexs}`
                                                ) as HTMLTextAreaElement
                                            )?.value
                                        };
                                    })
                            };
                        })
                });
                if (fetching) {
                    setLoading(false);
                    setOpacity('opacity-100');
                    setIsDisable(false);
                    e.target.reset();
                } else {
                    throw new Error('ERR: Server is down!');
                }
            } catch (err) {
                window.navigator.vibrate(200);
                setLoading(false);
                setIsDisable(false);
                setErrs(true);
                setTimeout(() => {
                    setErrs(false);
                    setOpacity('opacity-100');
                }, 3000);
            }
        }
    };
    const HandleClick = (e: any) => {
        e.preventDefault();
        setCards(cards + 1);
    };
    return (
        <div className='mt-5 sections scroll-mt-14 relative'>
            <div className={`sending-error-box ${errs ? 'flex' : 'hidden'}`}>
                <p className='font-mono text-sm sm:text-base md:text-lg lg:text-base text-orange-400 font-medium tracking-normal px-5 py-1 rounded bg-slate-500/[0.25] backdrop-blur border border-slate-600'>
                    <span className='font-bold text-red-500'>ERR</span>: Enter a
                    Valid WhatsApp number!
                </p>
            </div>
            <div
                className={`${loading ? 'flex' : 'hidden'} sending-loading-box`}
            >
                <div className='animate-shift px-12 sending-loading-content'></div>
                <div className='animate-shift2 px-8 sending-loading-content'></div>
                <div className='animate-shift3 px-10 sending-loading-content'></div>
            </div>
            <div className={`${opacity} content-box transition-all`}>
                <div className='text-lg tracking-tight'>
                    <p className='send-head'>
                        <FaWhatsapp className='mr-2' /> Send Carrousel Message
                    </p>
                    <p className='send-sub-head'>
                        Send custom carraousel message on whatsapp
                    </p>
                </div>
                <form
                    onSubmit={HandleSubmit}
                    className='send-form'
                >
                    <textarea
                        name='message'
                        placeholder='Your message goes here...'
                        className='h-24 send-input w-full resize-none'
                    ></textarea>
                    <input
                        name='participant'
                        placeholder='participant...'
                        type='text'
                        className='send-input w-full'
                    />
                    <textarea
                        name='quoted'
                        placeholder='quoted text...'
                        className='h-24 send-input w-full resize-none'
                    ></textarea>
                    <div className='send-input-group'>
                        {Array(cards)
                            ?.fill(0)
                            ?.map((item: any, indexs: number) => (
                                <div
                                    className='send-input-group'
                                    key={indexs}
                                >
                                    <Cards
                                        items={item}
                                        index={indexs}
                                        btn={btn}
                                        setBtn={setBtn}
                                    />
                                </div>
                            ))}
                        <button
                            type='button'
                            className='send-btn'
                            onClick={HandleClick}
                        >
                            Add cards +
                        </button>
                    </div>
                    <div className='send-input-group'>
                        <input
                            className='send-input'
                            placeholder='Enter your valid WhatsApp number'
                            type='text'
                            name='phone'
                        />
                        <button
                            type='submit'
                            className='send-btn'
                            disabled={isDisable}
                        >
                            {loading ? 'Sending...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
