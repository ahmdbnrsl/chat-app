export default async function DekstopView(props: any) {
    const { params } = props;
    return <h1>{params.id}</h1>;
}
