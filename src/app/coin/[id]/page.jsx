import ViewCoin from '@/section/ViewCoin';

export default async function page({ params }) {
  const { id } = await params;
  return <ViewCoin coinId={id} />;
}
