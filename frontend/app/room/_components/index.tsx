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

type Props = {
    roomData: CreateRoomResponse
}

const RoomRenderer = ({ roomData }: Props) => {
    const [playerUniqueId, setPlayerUniqueId] = useState<string | null>(null);

    useEffect(() => {
        setPlayerUniqueId(getSessionStorage<string>("UUID"));
    }, []);

    if (playerUniqueId === null) {
        return null;
    }

    const playerInfo = roomData.players.find(
        player => player.uuid === playerUniqueId
    );

    if (!playerInfo) {
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