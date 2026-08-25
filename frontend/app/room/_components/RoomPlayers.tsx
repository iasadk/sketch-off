import React from 'react'
import PlayerCard from './PlayerCard'
import { Player } from '@/lib/types'

type Props = {
  players: Player[]
}
const Players = [
  {
    position: 1,
    name: 'Asad Khan',
    points: 5
  },
  {
    position: 2,
    name: 'Arshad Khan',
    points: 5
  },
  {
    position: 3,
    name: 'Sana Khan',
    points: 5
  },
  {
    position: 4,
    name: 'Suhana Khan Malik',
    points: 5
  },
]
const RoomPlayers = ({players}: Props) => {
  return (
    <div className='bg-white h-full w-full  text-center font-semibold rounded-sm'>
      {
        players.map((player, idx) => <PlayerCard name={player.name} points={player.score} position={idx + 1} key={idx + 1}/>)
      }
    </div>
  )
}

export default RoomPlayers