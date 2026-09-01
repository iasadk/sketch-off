'use client'
import { cn } from "@/lib/util"
import { useGameStore } from "@/store/room"

const LeaderBoard = () => {
    const gameState = useGameStore((state) => state.gameState)
    const players = useGameStore((state) => state.players)
    const word = useGameStore((state) => state.prevChooseWord)

    const sortedPlayers = [...players].sort(
        (a, b) => b.score - a.score
    )

    const isGameOver = gameState === "GAME_OVER"

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-[2px]">
            <div className="w-90 rounded-2xl border border-slate-300 bg-white p-6 shadow-2xl">

                {/* Header */}
                <div className="text-center">
                    <div className="mb-2 text-4xl">
                        {isGameOver ? "🏆" : "⏰"}
                    </div>

                    <h2 className="text-3xl font-extrabold text-slate-900">
                        {isGameOver ? "Game Over!" : "Time's Up!"}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        {isGameOver
                            ? "Final scores are in!"
                            : "The round has ended."}
                    </p>

                    {/* Word */}
                    {!isGameOver && word && (
                        <p className="mt-3 text-sm text-slate-600">
                            The word was{" "}
                            <span className="font-bold text-orange-500">
                                {word}
                            </span>
                        </p>
                    )}
                </div>

                {/* Leaderboard */}
                <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
                    {sortedPlayers.map((player, index) => (
                        <div
                            key={`${player.name}-${index}`}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3",
                                index !== sortedPlayers.length - 1 &&
                                "border-b border-slate-200",
                                index === 0 && "bg-orange-50"
                            )}
                        >
                            {/* Rank */}
                            <div className="w-7 text-center text-sm font-bold">
                                {index === 0
                                    ? "🥇"
                                    : index === 1
                                        ? "🥈"
                                        : index === 2
                                            ? "🥉"
                                            : `#${index + 1}`}
                            </div>

                            {/* Name */}
                            <span className="flex-1 truncate text-sm font-semibold text-slate-800">
                                {player.name}
                            </span>

                            {/* Score */}
                            <span className="text-sm font-bold text-slate-900">
                                {player.score}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Winner - only on GAME_OVER */}
                {isGameOver && sortedPlayers.length > 0 && (
                    <div className="mt-5 text-center">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                            Winner
                        </p>

                        <p className="mt-1 text-lg font-extrabold text-orange-500">
                            {sortedPlayers[0].name} 🎉
                        </p>
                    </div>
                )}

                {isGameOver && <button
                    className="
                    mt-6 w-full rounded-xl
                    bg-orange-500
                    px-4 py-3
                    text-sm font-bold text-white
                    shadow-sm
                    transition
                    hover:bg-orange-600
                    active:scale-[0.98]
                    
                "
                onClick={() => {
                    window.location.href = "/"
                }
                }>
                    Go to Home
                </button>}
            </div>
        </div>
    )
}

export default LeaderBoard