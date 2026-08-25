'use client'
import { JoinFormType, JoinFormValidationSchema } from '@/lib/types'
import { cn, getSessionStorage, getUUID, setSessionStorage } from '@/lib/util'
import { parseApiError } from '@/rest-api/error'
import { joinRoom } from '@/rest-api/room'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

type Props = {
    onChange?: () => void,
    hideBottomLabel?: boolean,
    room_code?: string,
    disableCodeEdit?: boolean
}
const JoinRoomForm = ({ onChange, hideBottomLabel = false, room_code, disableCodeEdit = false }: Props) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<JoinFormType>({
        resolver: zodResolver(JoinFormValidationSchema),
        defaultValues:{
            player_name:"",
            room_code
        }
    });
    const errorToast = (msg: string) => toast.error(msg);
    const submitForm = async (data: JoinFormType) => {
        try {
            const unique_player_id = getSessionStorage<string>("UUID") ?? getUUID()
            const {data: res} = await joinRoom({...data, unique_player_id });
            reset()
            setSessionStorage("ROOM_CODE", res.code);
            setSessionStorage("UUID", unique_player_id);
            window.location.href = `/room/${encodeURI(res.code)}`;
        } catch (error: any) {
            if(axios.isAxiosError(error)){
                errorToast(parseApiError(error))
            }
        }
    }
    return (
        <form className="w-full max-w-md space-y-5 rounded-2xl bg-white/10 p-6 shadow-xl backdrop-blur-md" onSubmit={handleSubmit(submitForm)}>
            <div className="space-y-2">
                <label
                    htmlFor="player_name"
                    className="block text-sm font-semibold text-white"
                >
                    Enter Player Name
                </label>

                <input
                    id="player_name"
                    type="text"
                    placeholder="Mr. Cheeseburger"
                    {...register("player_name", { required: true })}
                    className={cn("w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 outline-none transition ",
                        {
                            "border-red-500 placeholder:text-red-500 text-red-500": errors.player_name,
                            "focus:border-white/50 focus:bg-white/15 focus:ring-2 focus:ring-white/20": !errors.player_name,
                        }
                    )}
                />
                {errors.player_name && <p className='text-red-500 font-medium'>{errors.player_name.message}</p>}
            </div>
            <div className="space-y-2">
                <label
                    htmlFor="room_code"
                    className="block text-sm font-semibold text-white"
                >
                    Enter Room Code
                </label>

                <input
                    id="room_code"
                    type="text"
                    disabled={disableCodeEdit}
                    placeholder="X1ERT4"
                    {...register("room_code", { required: true, max: 6, min: 6 })}
                    className={cn("w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 outline-none transition disabled:opacity-85 disabled:cursor-not-allowed",
                        {
                            "border-red-500 placeholder:text-red-500 text-red-500": errors.room_code,
                            "focus:border-white/50 focus:bg-white/15 focus:ring-2 focus:ring-white/20": !errors.room_code,
                        })}
                />
                {errors.room_code && <p className='text-red-500 font-medium'>{errors.room_code.message}</p>}

            </div>

            <button
                type="submit"
                className="w-full rounded-xl bg-pink-500 px-4 py-3 font-bold text-white transition hover:scale-[1.02] hover:bg-pink-400 active:scale-[0.98] cursor-pointer"
            >
                Join Room
            </button>
            {!hideBottomLabel && <div className='text-center'>
                <p className='text-slate-400'>Don't have a code ? <span className='underline hover:text-slate-700 cursor-pointer' onClick={onChange}>Create Room</span></p>
            </div>}
        </form>
    )
}

export default JoinRoomForm