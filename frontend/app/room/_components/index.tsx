'use client'
import HomeLayout from '@/app/components/Home'
import JoinRoomForm from '@/app/components/JoinRoomForm'
import { CreateRoomResponse } from '@/lib/types'
import { getSessionStorage } from '@/lib/util'
import { useEffect, useState } from 'react'
import Canvas from './canvas/Canvas'
import LiveChat from './LiveChat'
import RoomHeader from './RoomHeader'
import RoomPlayers from './RoomPlayers'
import { SocketProvider, useSocket } from '@/provider/websocket'
import SocketDevTools from './SocketDevtools'

type Props = {
    roomData: CreateRoomResponse
}

const RoomRenderer = ({ roomData }: Props) => {
    const [playerUniqueId, setPlayerUniqueId] = useState<string | null>(null);
    const { sendMessage, isReady } = useSocket()
    useEffect(() => {
        const unique_user_id = getSessionStorage<string>("UUID");
        setPlayerUniqueId(unique_user_id);
    }, []);

    // useEffect(() => {
    //     if (playerUniqueId && isReady) {
    //         console.log({ type: "JOIN", message: { playerUniqueId } }, isReady)
    //         sendMessage({ type: "JOIN", message: { unique_user_id: playerUniqueId } })
    //     }
    // }, [isReady])

    const playerInfo = roomData.players.find(
        player => player.uuid === playerUniqueId
    );

    if (!playerInfo || !playerUniqueId) {
        return (
            <HomeLayout>
                <div className="flex items-center justify-center">
                    <JoinRoomForm
                        hideBottomLabel={true}
                        room_code={roomData.code}
                        disableCodeEdit={true}
                    />
                </div>
            </HomeLayout>
        );
    }


    return (
        <div className="w-full flex justify-center items-center h-screen">
            <div className="w-full max-w-7xl">
                <div className="grid grid-cols-10 w-full gap-x-2 gap-y-2">
                    <div className="col-span-10">
                        <RoomHeader />
                        <SocketDevTools showTool={true} />
                    </div>
                    <div className="col-span-2">
                        <RoomPlayers players={roomData.players} />
                    </div>
                    <div className="col-span-6">
                        <Canvas />
                    </div>
                    <div className="col-span-2">
                        <LiveChat />
                    </div>
                </div>
            </div>
        </div>

    )
}

export default RoomRenderer