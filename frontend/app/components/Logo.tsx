'use client'
type Props = {}

const Logo = (props: Props) => {
  return (
    <p className='text-4xl font-bold leading-4 underline cursor-pointer' onClick={() => window.location.href = "/"}>SketchOff.io</p>
  )
}

export default Logo