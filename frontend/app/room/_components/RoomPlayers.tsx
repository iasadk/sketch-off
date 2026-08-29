'use client'
import { Player } from '@/lib/types'
import PlayerCard from './PlayerCard'
import { useSocket } from '@/provider/websocket'
import { useEffect, useState } from 'react'
import { useGameStore } from '@/store/room'
import { getSessionStorage } from '@/lib/util'
import { useShallow } from 'zustand/shallow'

type Props = {
}
const RoomPlayers = ({ }: Props) => {
  const players = useGameStore((state) => state.players)
  const { updatePlayers, updateIsOwner } = useGameStore(useShallow((state) => ({ updatePlayers: state.updatePlayers, updateIsOwner: state.updateIsOwner })))
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
        players.map((player, idx) => <PlayerCard name={player.name} points={player.score} position={idx + 1} key={idx + 1} isOwner={player.is_owner} uuid={player.uuid} />)
      }
    </div>
  )
}

export default RoomPlayers