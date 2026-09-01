'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
type Props = {}

const Logo = (props: Props) => {
  return (
    <Image
      src="/assets/logo-new.png"
      alt="Logo"
      width={400}
      height={100}
      // className="filter-[saturate(1.6)_contrast(1.15)_brightness(1.05)]"
      className="[filter:saturate(2)_contrast(1.25)_brightness(1.08)_drop-shadow(0_2px_6px_rgba(0,0,0,0.15))]"
    />
  )
}

export default Logo