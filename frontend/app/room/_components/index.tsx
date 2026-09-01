'use client'
import HomeLayout from '@/app/components/Home'
import JoinRoomForm from '@/app/components/JoinRoomForm'
import SessionCleanup from '@/app/components/SessionCleanUp'
import { CreateRoomResponse } from '@/lib/types'
import { getSessionStorage } from '@/lib/util'
import { useSocket } from '@/provider/websocket'
import { useGameStore } from '@/store/room'
import { useEffect, useState } from 'react'
import { useShallow } from 'zustand/shallow'
import Canvas from './canvas/Canvas'
import ChooseWords from './canvas/overlays/ChooseWords'
import GameNotStarted from './canvas/overlays/GameNotStarted'
import LeaderBoard from './canvas/overlays/LeaderBoard'
import StartGame from './canvas/overlays/StartGame'
import LiveChat from './LiveChat'
import RoomHeader from './RoomHeader'
import RoomPlayers from './RoomPlayers'

type Props = {
    roomData: CreateRoomResponse
}

const RoomRenderer = ({ roomData }: Props) => {
    const resetChats = useGameStore(state => state.resetChats)
    const {

        isOwner,
        updateGameState,
        updateArtist,
        gameState,
        artistId,
        updateWordsList,
        updateChooseWordStartedAt,
        updateChooseWordDuration,
        updateRoundStartedAt,
        updateRoundDuration,
        updateTotalRounds,
        updateCurrentRound,
        updateChoosedWord,
        updatePrevChoosedWord,
        updateRoundOverStartedAt,
        updateRoundOverDuration

    } = useGameStore(useShallow((state) => ({
        isOwner: state.is_owner,
        updateGameState: state.updateGameState,
        updateArtist: state.updateArtist,
        gameState: state.gameState,
        artistId: state.artistId,
        updateWordsList: state.updateWordsList,
        updateChooseWordStartedAt: state.updateChooseWordStartedAt,
        updateChooseWordDuration: state.updateChooseWordDuration,
        updateRoundStartedAt: state.updateRoundStartedAt,
        updateRoundDuration: state.updateRoundDuration,
        updateTotalRounds: state.updateTotalRounds,
        updateCurrentRound: state.updateCurrentRound,
        updateChoosedWord: state.updateChoosedWord,
        updatePrevChoosedWord: state.updatePrevChoosedWord,
        updateRoundOverStartedAt: state.updateRoundOverStartedAt,
        updateRoundOverDuration: state.updateRoundOverDuration,
    })))
    const { subscribe } = useSocket()
    const [playerUniqueId, setPlayerUniqueId] = useState<string | null>(null);
    useEffect(() => {
        const unique_user_id = getSessionStorage<string>("UUID");
        setPlayerUniqueId(unique_user_id);
        resetChats()
    }, []);

    useEffect(() => {
        const unsubscribers: (() => void)[] = []
        const unsubscribeGameState = subscribe("GAME_STATE", (message) => {
            const {
                game_state,
                current_round,
                total_rounds,
                artist_id,
                choose_word_duration,
                choose_word_started_at,
                round_duration,
                round_started_at,
                choosed_word,
                round_over_started_at,
                round_over_duration
            } = message.content
            updateGameState(game_state);
            updateArtist(artist_id);
            updateChooseWordDuration(choose_word_duration ?? 0);
            updateChooseWordStartedAt(choose_word_started_at ?? null);
            updateRoundDuration(round_duration ?? 0);
            updateRoundStartedAt(round_started_at ?? null);
            updateCurrentRound(current_round);
            updateTotalRounds(total_rounds);
            updateChoosedWord(choosed_word);
            updateRoundOverStartedAt(round_over_started_at)
            updateRoundOverDuration(round_over_duration)
            console.log("[CURRENT GAME STATE]: ", game_state)
            console.log("[CURRENT ARTIST STATE]: ", artist_id)
            console.log("[CURRENT TIME STATE]: ", { choose_word_duration, choose_word_started_at, round_duration, round_started_at })
        })
        const unsubscribeSelectWord = subscribe("SELECT_WORD", (message) => {
            console.log("[EVENT]: SELECT WORD", message)
            const { words } = message.content
            updateWordsList(words)
        })
        const unsubscribeRoundOver = subscribe("ROUND_OVER", (message) => {
            console.log("[EVENT]: ROUND OVER", message)
            const { prev_choosed_word } = message.content
            updatePrevChoosedWord(prev_choosed_word)

        })
        unsubscribers.push(unsubscribeGameState, unsubscribeSelectWord, unsubscribeRoundOver)

        return () => {
            unsubscribers.forEach(unsubscribe => unsubscribe())
        }
    }, [subscribe])


    const playerInfo = roomData.players.find(
        player => player.uuid === playerUniqueId
    );

    if (!playerInfo || !playerUniqueId) {
        return (
            <HomeLayout>
                <div className="flex items-center justify-center">
                    <JoinRoomForm
                        hideBottomLabel={true}
                        room_code={roomData.code}
                        disableCodeEdit={true}
                    />
                </div>
            </HomeLayout>
        );
    }

    const playAreaRenderer = () => {
        if (gameState === "NOT_STARTED" && isOwner) {
            return <StartGame />
        } else if (gameState === "NOT_STARTED" && !isOwner) {
            return <GameNotStarted />
        } else if (gameState === "CHOOSING_WORD") {
            return <ChooseWords />
        } else if (gameState === "ROUND_OVER" || gameState === "GAME_OVER") {
            return <LeaderBoard />
        }
    }

    return (
        <>
            <SessionCleanup />
            <div className="w-full h-full flex justify-center items-center overflow-hidden flex-col">
                <div className="w-full max-w-7xl h-full py-4">
                    <div className="grid grid-cols-10 grid-rows-[auto_1fr] w-full h-full gap-x-2 gap-y-2">
                        <div className="col-span-10">
                            <RoomHeader />
                        </div>

                        <div className="col-span-2 min-h-0 h-full">
                            <RoomPlayers />
                        </div>

                        <div className="col-span-6 relative min-h-0 h-full">
                            {playAreaRenderer()}
                            <Canvas />
                        </div>

                        <div className="col-span-2 min-h-0 h-full">
                            <LiveChat />
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default RoomRenderer