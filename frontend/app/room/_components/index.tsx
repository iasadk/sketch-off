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
import SessionCleanup from '@/app/components/SessionCleanUp'
import { useGameStore } from '@/store/room'
import { useShallow } from 'zustand/shallow'
import StartGame from './canvas/overlays/StartGame'
import GameNotStarted from './canvas/overlays/GameNotStarted'

type Props = {
    roomData: CreateRoomResponse
}

const RoomRenderer = ({ roomData }: Props) => {
    const { isOwner } = useGameStore(useShallow((state) => ({ isOwner: state.is_owner })))

    const [playerUniqueId, setPlayerUniqueId] = useState<string | null>(null);
    useEffect(() => {
        const unique_user_id = getSessionStorage<string>("UUID");
        setPlayerUniqueId(unique_user_id);
    }, []);

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

    const playAreaRenderer = () => {
        if (isOwner){
            return <StartGame/>
        }else{
            return <GameNotStarted/>
        }
    }
    return (
        <>
            <SessionCleanup />
            <div className="w-full flex justify-center items-center h-screen">
                <div className="w-full max-w-7xl">
                    <div className="grid grid-cols-10 w-full gap-x-2 gap-y-2">
                        <div className="col-span-10">
                            <RoomHeader />
                            <SocketDevTools showTool={true} />
                        </div>
                        <div className="col-span-2">
                            <RoomPlayers />
                        </div>
                        <div className="col-span-6 relative">
                            {playAreaRenderer()}
                            <Canvas />
                        </div>
                        <div className="col-span-2">
                            <LiveChat />
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default RoomRenderer