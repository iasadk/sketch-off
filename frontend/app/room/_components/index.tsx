'use client'
import { CreateRoomResponse } from '@/lib/types'
import Canvas from './canvas/Canvas'
import LiveChat from './LiveChat'
import RoomHeader from './RoomHeader'
import RoomPlayers from './RoomPlayers'
import { getSessionStorage } from '@/lib/util'
import JoinRoomForm from '@/app/components/JoinRoomForm'
import HomeLayout from '@/app/components/Home'

type Props = {
    roomData: CreateRoomResponse
}

const RoomRenderer = ({ roomData }: Props) => {
    const player_unique_id = getSessionStorage<string>("UUID") ?? "";
    const playerInfo = roomData.players.find(player => player.uuid === player_unique_id);
    if (!playerInfo) {
        // show join room ui
        return <HomeLayout>
            <div className='flex items-center justify-center '>
                <JoinRoomForm hideBottomLabel={true} room_code={roomData.code} disableCodeEdit={true}/>
            </div>
        </HomeLayout>
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