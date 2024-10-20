'use server';
export async function sendCustomMess({
    number,
    mess,
    rep,
    quoted,
    buttons,
    messParams
}: {
    number: string;
    mess: string;
    rep: string;
    quoted: string;
    buttons: Array<object>;
    messParams: string;
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
            buttons: JSON.stringify(buttons),
            messParams
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

export async function getListGroup(): Promise<
    Array<{ id: string; name: string }> | false
> {
    const option: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            secret: process.env.SECRET_TOKEN
        }),
        next: {
            revalidate: 90
        }
    };
    try {
        const response: Response = await fetch(
            process.env.NEXT_PUBLIC_BASE_URL + '/chats',
            option
        );
        const list: { result: string } = await response.json();
        const newList: Array<[string, object]> = JSON.parse(list?.result);
        const result: Array<{ id: string; name: string }> = newList?.map(
            (item: any): { id: string; name: string } => {
                return {
                    id: item?.[0],
                    name: item?.[1]?.subject
                };
            }
        );

        return result;
    } catch (e) {
        return false;
    }
}
