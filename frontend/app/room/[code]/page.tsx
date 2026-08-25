import { getRoom } from "@/rest-api/room"
import axios from "axios"
import { notFound } from "next/navigation"
import RoomRenderer from "../_components"
import { SocketProvider } from "@/provider/websocket"

type Props = {
  params: Promise<{
    code: string
  }>
}
const getRoomInfo = async (code: string) => {
  try {
    const res = await getRoom(code);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null
    }

    throw error
  }
}
const Page = async ({ params }: Props) => {
  const { code } = await params;
  const roomData = await getRoomInfo(code);
  if (!roomData) {
    notFound();
  }
  return (
    <SocketProvider roomCode={roomData.code}>
      <RoomRenderer roomData={roomData} />
    </SocketProvider>
  )
}

export default Page