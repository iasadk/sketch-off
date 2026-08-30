import { ChatFormType, ChatFormValidationSchema } from '@/lib/types';
import { cn, getSessionStorage } from '@/lib/util';
import { useSocket } from '@/provider/websocket';
import { useGameStore } from '@/store/room';
import { zodResolver } from '@hookform/resolvers/zod';
import { error } from 'console';
import { useForm } from 'react-hook-form';

type Props = {}

const ChatInput = (props: Props) => {
    const artistId = useGameStore((state) => state.artistId)
    const isArtist = artistId === (getSessionStorage("UUID") ?? "")
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ChatFormType>({
        resolver: zodResolver(ChatFormValidationSchema),
        defaultValues: {
            msg: '',
        }
    });

    const { sendMessage } = useSocket()
    const submit = (data: ChatFormType) => {
        sendMessage({ type: "CHAT", "content": { msg: data.msg, color: "BLACK" } })
        reset()
    }
    return (
        <form className='mt-2' onSubmit={handleSubmit(submit)}>
            <div className="space-y-2">
                <input
                    disabled={isArtist}
                    id="msg"
                    type="text"
                    placeholder="Type your guess here"
                    {...register("msg", { required: true })}
                    className={cn("w-full rounded-sm border border-slate-400 bg-white/10 px-2 py-1 text-black placeholder-slate-400 outline-none transition text-sm",
                        {
                            "border-red-500 placeholder:text-red-500 text-red-500": errors.msg,
                            "focus:border-slate-400 focus:bg-white/15 focus:ring-2 focus:ring-white/20": !errors.msg,
                            "cursor-not-allowed": isArtist
                        }
                    )}
                />
                {/* {errors.msg && <p className='text-red-500 font-medium'>{errors.msg.message}</p>} */}
            </div>
        </form>
    )
}

export default ChatInput