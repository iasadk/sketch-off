import React from 'react'

type Props = {}

const GameNotStarted = (props: Props) => {
  return (
    <div className='bg-black/60 h-full w-full absolute flex flex-col items-center justify-center'>
      <div className='text-white text-center'>
        <h2 className='text-2xl font-bold tracking-wide'>
          Game Not Started
        </h2>

        <p className='text-sm font-semibold mt-3 tracking-wide animate-pulse'>
          {'< '}Waiting for the owner to start the game{' >'}
        </p>
      </div>
    </div>
  )
}

export default GameNotStarted
