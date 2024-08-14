export default async function MobileView(props: any) {
    const { params } = props;
    return <h1>{params.id}</h1>;
}
