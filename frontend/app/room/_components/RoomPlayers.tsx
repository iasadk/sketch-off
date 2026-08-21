import React from 'react'
import PlayerCard from './PlayerCard'

type Props = {}
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
const RoomPlayers = (props: Props) => {
  return (
    <div className='bg-white h-full w-full  text-center font-semibold rounded-sm'>
      {
        Players.map((player, idx) => <PlayerCard name={player.name} points={player.points} position={player.position} key={idx}/>)
      }
    </div>
  )
}

export default RoomPlayers