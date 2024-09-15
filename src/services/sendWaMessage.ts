'use server';
export async function sendCustomMess({
    number,
    mess,
    rep,
    quoted,
    buttons
}: {
    number: string;
    mess: string;
    rep: string;
    quoted: string;
    buttons: Array<object>;
}): Promise<boolean> {
    const option = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            secret: process.env.SECRET_TOKEN,
            number,
            mess,
            rep,
            quoted,
            buttons: JSON.stringify(buttons)
        })
    };
    return await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + '/custom',
        option
    ).then((res: any): boolean => (res.status == 200 ? true : false));
}

export async function sendCarrouselMess({
    number,
    text,
    quoted,
    cards
}: {
    number: string;
    text: string;
    quoted: string;
    cards: Array<object>;
}): Promise<boolean> {
    const option = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            secret: process.env.SECRET_TOKEN,
            number,
            text,
            quoted,
            cards: JSON.stringify(cards)
        })
    };
    return await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + '/carrousel',
        option
    ).then((res: any): boolean => (res.status == 200 ? true : false));
}