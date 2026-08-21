import Canvas from './canvas/Canvas'
import LiveChat from './LiveChat'
import RoomHeader from './RoomHeader'
import RoomPlayers from './RoomPlayers'

type Props = {}

const RoomRenderer = (props: Props) => {
    return (
        <div className="w-full flex justify-center items-center h-screen">
            <div className="w-full max-w-7xl">
                <div className="grid grid-cols-10 w-full gap-x-2 gap-y-2">
                    <div className="col-span-10">
                        <RoomHeader />
                    </div>
                    <div className="col-span-2">
                        <RoomPlayers />
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