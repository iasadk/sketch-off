import { getSessionStorage } from '@/lib/util';
import { parseApiError } from '@/rest-api/error';
import { startGame } from '@/rest-api/room';
import axios from 'axios';
import toast from 'react-hot-toast';

type Props = {}

const StartGame = (props: Props) => {
  const errorToast = (msg: string) => toast.error(msg);
  const handleStartGame = async () => {
    const room_code: string | null = getSessionStorage("ROOM_CODE")
    const unique_player_id: string | null = getSessionStorage("UUID")
    if (!room_code || !unique_player_id) {
      errorToast("Not connected to any room !!")
      return
    }

    try {
      await startGame({ room_code, unique_player_id })
    } catch (error) {
      if (axios.isAxiosError(error)) {
        errorToast(parseApiError(error))
      }
    }
  }
  return (
    <div className='bg-black/60 h-full w-full absolute flex flex-col items-center justify-center'>
      <button type='button' className='rounded-sm border-2 border-white px-4 py-3 font-bold text-xl animate-pulse cursor-pointer hover:shadow-2xl' onClick={handleStartGame}>Start Game</button>
      <p className='text-sm font-semibold mt-3 tracking-wide'>{'< '}Click the button to start{' >'}</p>
    </div>
  )
}

export default StartGame