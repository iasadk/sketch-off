'use client'
import { getSessionStorage } from '@/lib/util'
import { useSocket } from '@/provider/websocket'
import { useGameStore } from '@/store/room'
import { useEffect } from 'react'
import { useShallow } from 'zustand/shallow'
import PlayerCard from './PlayerCard'

type Props = {
}
const RoomPlayers = ({ }: Props) => {
  const players = useGameStore((state) => state.players)
  const { updatePlayers, updateIsOwner, artistId } = useGameStore(useShallow((state) => ({ updatePlayers: state.updatePlayers, updateIsOwner: state.updateIsOwner, artistId: state.artistId })))
  const { subscribe } = useSocket();
  useEffect(() => {
    const unsubscribe = subscribe("PLAYERS", ({ content }) => {
      const uuid = getSessionStorage("UUID")
      const pList = content.players
      const isOwner = Boolean(pList.find(player => player.uuid === uuid)?.is_owner)
      updatePlayers(pList)
      updateIsOwner(isOwner)
    })

    return unsubscribe
  }, [subscribe])

  return (
    <div className='bg-white h-full w-full  text-center font-semibold rounded-sm'>
      {
        players.map((player, idx) => <PlayerCard name={player.name} points={player.score} position={idx + 1} key={idx + 1} isOwner={player.is_owner} uuid={player.uuid} isArtist={player.uuid === artistId}/>)
      }
    </div>
  )
}

export default RoomPlayers