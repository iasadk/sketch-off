'use client'
import RandomAvatar from "@/app/components/RandomAvatar"
import { cn, getSessionStorage } from "@/lib/util"
import { Brush, Crown } from "lucide-react"

type Props = {
  position: number,
  name: string,
  points: number,
  isOwner: boolean;
  uuid: string;
  isArtist: boolean,
  is_guessed: boolean
}
const PlayerCard = ({
  position,
  name,
  points,
  isOwner,
  uuid,
  isArtist,
  is_guessed
}: Props) => {
  const uniqueUserId = getSessionStorage('UUID')

  return (
    <div className={cn("flex items-center text-black py-2 px-2 border-b border-slate-300",
      {
        "bg-green-500/30": is_guessed
      }
    )}>
      {/* Position */}
      <div className="w-10 shrink-0">
        <p className="text-xs flex items-center gap-x-1">
          #{position}
          {isOwner && (
            <span title="Owner">
              <Crown className="w-4 h-4 text-yellow-400 fill-yellow-200" />
            </span>
          )}
        </p>
      </div>

      {/* Player info */}
      <div className="flex-1 min-w-0">
        <p
          className="line-clamp-1 font-medium text-black text-sm tracking-wide"
          title={name}
        >
          {name} {uniqueUserId === uuid ? '(YOU)' : null}
        </p>

        <p className="text-xs">
          {points} points
        </p>
      </div>

      {/* Avatar */}
      <div className="w-10 shrink-0 flex justify-center">
        <RandomAvatar
          size={32}
          seed={position.toString()}
        />
      </div>

      {/* Artist indicator */}
      <div className="w-8 shrink-0 flex justify-end">
        {isArtist && (
          <div
            className="w-7 h-7 flex items-center justify-center rounded-full
                       bg-violet-100 text-violet-600 ring-1 ring-violet-200"
            title="Currently drawing"
          >
            <Brush className="w-4 h-4" />
          </div>
        )}
      </div>

    </div>
  )
}

export default PlayerCard