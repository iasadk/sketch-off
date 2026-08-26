'use client'
import { useRouter } from 'next/navigation';
type Props = {}

const Logo = (props: Props) => {
  const router = useRouter()
  return (
    <p className='text-4xl font-bold leading-4 underline cursor-pointer' onClick={() => router.push("/")}>SketchOff.io</p>
  )
}

export default Logo