'use client'
import React, { useState } from 'react'
import CreateRoomForm from './CreateRoomForm';
import JoinRoomForm from './JoinRoomForm';

type Props = {}

const FormRenderer = (props: Props) => {
    const [currentView, setCurrentView] = useState<'CREATE' | 'JOIN'>("CREATE");
  return (
    <div className='flex items-center justify-center '>
        {
            currentView === "CREATE" ? <CreateRoomForm onChange={() => setCurrentView(prev => 'JOIN')}/> : <JoinRoomForm onChange={() => setCurrentView(prev => 'CREATE')}/>
        }
    </div>
  )
}

export default FormRenderer