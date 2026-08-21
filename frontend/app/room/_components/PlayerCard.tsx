import RandomAvatar from "@/app/components/RandomAvatar"

type Props = {
  position: number,
  name: string,
  points: number,
}

const PlayerCard = ({position, name, points}: Props) => {
  return (
    <div className="flex justify-between items-center text-black py-2 px-2 border-b border-slate-300">
      <p className="text-xs">
        #{position}
      </p>
      <div>
        <p className='line-clamp-1 font-medium text-black text-sm' title={name}>{name}</p>
        <p className='text-center text-xs'>{points} points</p>
      </div>
      <RandomAvatar size={32} seed={position.toString()}/>
    </div>
  )
}

export default PlayerCard