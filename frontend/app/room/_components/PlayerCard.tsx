'use client'
import RandomAvatar from "@/app/components/RandomAvatar"
import { getSessionStorage } from "@/lib/util"
import { Crown } from "lucide-react"

type Props = {
  position: number,
  name: string,
  points: number,
  isOwner: boolean;
  uuid: string
}

const PlayerCard = ({position, name, points, isOwner, uuid}: Props) => {
  const uniqueUserId = getSessionStorage('UUID')

  return (
    <div className="flex justify-between items-center text-black py-2 px-2 border-b border-slate-300">
      <p className="text-xs flex items-center gap-x-1">
        #{position}
        {isOwner && <span title="Owner"><Crown className="text-yellow-400 fill-yellow-200"/></span>}
      </p>
      <div>
        <p className='line-clamp-1 font-medium text-black text-sm tracking-wide' title={name}>{name} {uniqueUserId === uuid ? `(YOU)` : null}</p>
        <p className='text-center text-xs'>{points} points</p>
      </div>
      <RandomAvatar size={32} seed={position.toString()}/>
    </div>
  )
}

export default PlayerCard