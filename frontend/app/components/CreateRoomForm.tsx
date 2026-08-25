'use client'
import { CreateFormType, CreateFormValidationSchema } from '@/lib/types'
import { cn } from '@/lib/util'
import { parseApiError } from '@/rest-api/error'
import { createRoom } from '@/rest-api/room'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

type Props = {
    onChange: () => void
}

const CreateRoomForm = ({ onChange }: Props) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateFormType>({
        resolver: zodResolver(CreateFormValidationSchema),
    });

    const errorToast = (msg: string) => toast.error(msg);
    const submitForm = async (data: CreateFormType) => {
        try {
            const {data: res} = await createRoom(data);
            // console.log(res)
            window.location.href = `/room/${encodeURI(res.code)}`;
        } catch (error: any) {
            if(axios.isAxiosError(error)){
                errorToast(parseApiError(error))
            }
        }
    }
    return (
        <form
            className="w-full max-w-md space-y-5 rounded-2xl bg-white/10 p-6 shadow-xl backdrop-blur-md"
            onSubmit={handleSubmit(submitForm)}
        >
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
                    htmlFor="room_name"
                    className="block text-sm font-semibold text-white"
                >
                    Enter Room Name
                </label>

                <input
                    id="room_name"
                    type="text"
                    placeholder="Party Time !!"
                    {...register("room_name", { required: true })}
                    className={cn("w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 outline-none transition ",
                        {
                            "border-red-500 placeholder:text-red-500 text-red-500": errors.room_name,
                            "focus:border-white/50 focus:bg-white/15 focus:ring-2 focus:ring-white/20": !errors.room_name,
                        }
                    )}
                />
                {errors.room_name && <p className='text-red-500 font-medium'>{errors.room_name.message}</p>}
            </div>


            <button
                type="submit"
                className="w-full rounded-xl bg-white px-4 py-3 font-bold text-gray-900 transition hover:scale-[1.02] hover:bg-gray-100 active:scale-[0.98] cursor-pointer"
            >
                Create Room
            </button>
            <div className='text-center'>
                <p className='text-slate-400'>Have a code ? <span className='underline hover:text-slate-700 cursor-pointer' onClick={onChange}>Join Room</span></p>
            </div>
        </form>
    )
}

export default CreateRoomForm