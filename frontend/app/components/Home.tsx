import React, { ReactNode } from 'react'
import Logo from './Logo'

type Props = {
    children: ReactNode
}

const HomeLayout = ({ children }: Props) => {
    return (
        <div
            className="h-screen w-full"
        >
            <div className="flex justify-center my-8">
                <Logo />
            </div>
            {children}
        </div>
    )
}

export default HomeLayout