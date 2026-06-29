// frontend/app/channel/[userId]/page.tsx
import Header from "@/components/header/Header";
import ChannelClient from "./ChannelClient";
import { getChannel } from "@/lib/api/channels";


export default async function ChannelPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const channel = await getChannel(Number(userId));

  return (
    <>
      <Header />
      <ChannelClient channel={channel} />
    </>
  );
}
