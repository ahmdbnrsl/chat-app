'use client';
export default function HelloWorld() {
    const text: string = `Inget gak sih, waktu pertama kali kita duduk di depan komputer, ngetik ‘Hello World’? Rasanya kayak baru kemarin aja, padahal itu momen awal yang ngerubah segalanya. Kita mungkin dulu cuma anak-anak penasaran, gak tau apa-apa soal dunia coding. Tapi waktu itu, dengan sedikit bimbingan atau bahkan hanya modal nekat, kita ngetik dua kata sederhana yang akhirnya ngasih kita rasa percaya diri yang luar biasa.\n\nItu momen ketika kita mulai sadar, ‘Oh, jadi gini ya rasanya bikin sesuatu di dunia digital.’ Padahal cuma satu baris kode, tapi efeknya bener-bener dalem. Hati kita berdebar waktu layar itu akhirnya bales, ‘Hello World’. Gak ada yang ngerti gimana rasanya, kecuali mereka yang pernah ngerasain sendiri. Itu bukan sekadar teks di layar, tapi simbol dari pintu gerbang yang baru kita buka.\n\nWaktu itu, kita gak ngerti betapa pentingnya momen itu. Gak ada yang nyangka kalau dari situ, kita bakal ngelewatin malam-malam panjang, ngulik bug, nyari solusi, dan jatuh cinta sama dunia yang dulu asing buat kita. Satu baris kode itu bener-bener kayak percikan api kecil yang kemudian jadi nyala api gede dalam hidup kita.\n\nSekarang, kalau diinget-inget lagi, ‘Hello World’ itu jadi titik awal perjalanan yang penuh tantangan tapi juga penuh kebanggaan. Kita yang dulu cuma ngetik dua kata tanpa ngerti apa-apa, sekarang udah bisa bikin sesuatu yang bikin kita bangga.\n\ntetap semangat ya :)`;
    return (
        <div
            onClick={() => console.log('Hello World!')}
            className='h-screen w-screen bg-white p-6 flex justify-center items-center flex-col'
        >
            <h1 className='text-black text-4xl font-bold font-serif'>
                Hello World!
            </h1>
            <pre
                className='whitespace-pre-wrap text-sm font-normal text-zinc-900 mt-20 w-full max-w-3xl'
                style={{ fontFamily: 'inherit' }}
            >
                {text}
            </pre>
        </div>
    );
}
