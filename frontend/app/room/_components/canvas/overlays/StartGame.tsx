import React from 'react'

type Props = {}

const StartGame = (props: Props) => {
  return (
    <div className='bg-black/60 h-full w-full absolute flex flex-col items-center justify-center'>
        <button type='button' className='rounded-sm border-2 border-white px-4 py-3 font-bold text-xl animate-pulse cursor-pointer hover:shadow-2xl'>Start Game</button>
        <p className='text-sm font-semibold mt-3 tracking-wide'>{'< '}Click the button to start{' >'}</p>
    </div>
  )
}

export default StartGame