import { useGameStore } from "@/store/room"

const LeaderBoard = () => {
    const gameState = useGameStore((state) => state.gameState)
    const players = useGameStore((state) => state.players)
    const word = useGameStore((state) => state.prevChooseWord)
    return (
        <div className="bg-black/60 h-full w-full absolute inset-0 z-50 flex flex-col items-center justify-center">
            <div className="text-white w-72.5">
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-2xl font-semibold tracking-wide">
                        The word was{" "}
                        <span className="font-bold text-orange-300">
                            {word}
                        </span>
                    </h2>

                    <p className="text-lg mt-1 tracking-wide">
                        Time is up!
                    </p>
                </div>

                {/* Leaderboard */}
                <div className="mt-8 space-y-1">
                    {players.map((player, index) => (
                        <div
                            key={`${player.name}-${index}`}
                            className="flex items-center justify-between text-lg font-medium"
                        >
                            <span className="truncate max-w-50">
                                {player.name}
                            </span>

                            <span>
                                {player.score}
                            </span>
                        </div>
                    ))}
                </div>
                {gameState === "GAME_OVER" && <div>
                    <p>GAME OVER</p>
                </div>}
            </div>
        </div>
    )
}

export default LeaderBoard