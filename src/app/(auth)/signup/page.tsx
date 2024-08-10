'use client';

import { FaUserPlus } from 'react-icons/fa6';
import { useState, ChangeEvent, FormEvent } from 'react';
import Loading from './loading';
import Style from './signup.style.json';

export default function SignUpPage() {
    const [load, setLoad] = useState<boolean>(false);
    const [labelName, setLabelName] = useState<string>('Enter your fullname');
    const [labelWaNumber, setLabelWaNumber] = useState<string>(
        'Enter your WhatsApp number (e.g, 08212345)'
    );

    const SignUp = (e: FormEvent<HTMLFormElement>) => {
        interface Data extends EventTarget {
            name: HTMLInputElement;
            wa: HTMLInputElement;
        }
        e.preventDefault();
        const ev: Data = e.target as Data;
        const nameUser = ev.name.value;
        const waNumber = ev.wa.value;
        const validate = (data: string, type: string): boolean => {
            if (type === 'name') {
                if (
                    data === '' ||
                    (data !== '' && data.replace(/\s/g, '') === '') ||
                    data.length < 5 ||
                    data.length > 25
                ) {
                    return false;
                } else return true;
            } else {
                if (
                    data === '' ||
                    !Number(data) ||
                    data.length < 9 ||
                    data.length > 20
                ) {
                    return false;
                } else return true;
            }
        };
        if (!validate(nameUser, 'name')) {
            ev.name.focus();
        } else if (!validate(waNumber, 'wa')) {
            ev.wa.focus();
        } else {
            setLoad(true);
        }
    };

    const InputChangeValidate = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.className.startsWith('name')) {
            const data = e.target.value;
            if (data !== '' && data.replace(/\s/g, '') === '')
                setLabelName('Name must not only space!');
            if (data.length < 5) setLabelName('Enter at least 5 letters');
            if (data.length > 25)
                setLabelName('Name must not exceed 25 letters');
            if (
                data === '' ||
                (data.length >= 5 &&
                    data.length <= 25 &&
                    data.replace(/\s/g, '') !== '')
            )
                setLabelName('Enter your fullname');
        } else {
            const data = e.target.value;
            if (!Number(data)) setLabelWaNumber('Enter number only');
            if (data.length < 9) setLabelWaNumber('Enter at least 9 digits');
            if (data.length > 20)
                setLabelWaNumber('WhatsApp number must not exceed 20 numbers');
            if (
                data === '' ||
                (data.length >= 9 && data.length < 21 && Number(data))
            )
                setLabelWaNumber('Enter your WhatsApp number (e.g, 08212345)');
        }
    };

    return (
        <main className={Style.mainStyle}>
            <section className={Style.sectionStyle}>
                <div className={Style.rootBoxStyle}>
                    <div className={Style.headerBorderStyle}>
                        <div className={Style.headerStyle}>
                            <h1 className={Style.headerTitleStyle}>
                                <FaUserPlus /> Sign Up
                            </h1>
                            <p className={Style.headerSubtitleStyle}>
                                Welcome back!, please enter your detail below
                            </p>
                        </div>
                    </div>
                    <form
                        onSubmit={SignUp}
                        className={Style.formStyle}
                    >
                        <div className={Style.inputBoxStyle}>
                            <input
                                onChange={InputChangeValidate}
                                type='text'
                                id='name'
                                name='name'
                                maxLength={25}
                                placeholder='...'
                                className={Style.inputNameStyle}
                            />
                            <label
                                htmlFor='name'
                                className={Style.labelStyle}
                            >
                                {labelName}
                            </label>
                        </div>
                        <div className={Style.inputNameStyle}>
                            <input
                                onChange={InputChangeValidate}
                                type='text'
                                id='wa'
                                name='wa'
                                maxLength={20}
                                placeholder='...'
                                className={Style.inputWAStyle}
                            />
                            <label
                                htmlFor='wa'
                                className={Style.labelStyle}
                            >
                                {labelWaNumber}
                            </label>
                        </div>
                        <button
                            disabled={load ? true : false}
                            type='submit'
                            className={`${Style.buttonStyle} ${
                                load
                                    ? 'bg-zinc-900 text-zinc-500'
                                    : 'bg-gradient-to-br from-zinc-200 to-zinc-400 text-zinc-950'
                            }`}
                        >
                            {load ? (
                                <>
                                    <Loading /> {'Loading...'}
                                </>
                            ) : (
                                'Sign Up'
                            )}
                        </button>
                    </form>
                    <p className={Style.footerStyle}>
                        Already have an account?{' '}
                        <span className='text-zinc-200 font-medium'>Login</span>
                    </p>
                </div>
            </section>
        </main>
    );
}
