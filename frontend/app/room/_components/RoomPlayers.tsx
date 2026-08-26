'use client'
import { Player } from '@/lib/types'
import PlayerCard from './PlayerCard'
import { useSocket } from '@/provider/websocket'
import { useEffect, useState } from 'react'

type Props = {
}
const RoomPlayers = ({ }: Props) => {
  const [players, setPlayers] = useState<Player[]>([])
  const {subscribe} = useSocket();

  useEffect(() => {
    const unsubscribe = subscribe("PLAYERS", ({content}) =>{
      console.log(content, "JOINED")
      setPlayers(content.players as Player[])
    })
  
    return unsubscribe
  }, [subscribe])
  
  return (
    <div className='bg-white h-full w-full  text-center font-semibold rounded-sm'>
      {
        players.map((player, idx) => <PlayerCard name={player.name} points={player.score} position={idx + 1} key={idx + 1} isOwner={player.is_owner} />)
      }
    </div>
  )
}

export default RoomPlayers