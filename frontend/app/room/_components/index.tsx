'use client'
import HomeLayout from '@/app/components/Home'
import JoinRoomForm from '@/app/components/JoinRoomForm'
import { CreateRoomResponse } from '@/lib/types'
import { getSessionStorage } from '@/lib/util'
import { useEffect, useState } from 'react'
import Canvas from './canvas/Canvas'
import LiveChat from './LiveChat'
import RoomHeader from './RoomHeader'
import RoomPlayers from './RoomPlayers'
import { SocketProvider, useSocket } from '@/provider/websocket'
import SocketDevTools from './SocketDevtools'
import SessionCleanup from '@/app/components/SessionCleanUp'
import { useGameStore } from '@/store/room'
import { useShallow } from 'zustand/shallow'
import StartGame from './canvas/overlays/StartGame'
import GameNotStarted from './canvas/overlays/GameNotStarted'
import ChooseWords from './canvas/overlays/ChooseWords'

type Props = {
    roomData: CreateRoomResponse
}

const RoomRenderer = ({ roomData }: Props) => {
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
        updateChoosedWord

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
        updateChoosedWord: state.updateChoosedWord
    })))
    const { subscribe } = useSocket()
    const [playerUniqueId, setPlayerUniqueId] = useState<string | null>(null);
    useEffect(() => {
        const unique_user_id = getSessionStorage<string>("UUID");
        setPlayerUniqueId(unique_user_id);
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
                choosed_word
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
            console.log("[CURRENT GAME STATE]: ", game_state)
            console.log("[CURRENT ARTIST STATE]: ", artist_id)
            console.log("[CURRENT TIME STATE]: ", { choose_word_duration, choose_word_started_at, round_duration, round_started_at })
        })
        const unsubscribeSelectWord = subscribe("SELECT_WORD", (message) => {
            const { words } = message.content
            updateWordsList(words)
        })
        unsubscribers.push(unsubscribeGameState, unsubscribeSelectWord)

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
        } else if (gameState === "CHOOSING_WORD" && playerUniqueId === artistId) {
            return <ChooseWords />
        }
    }

    return (
        <>
            <SessionCleanup />
            <div className="w-full flex justify-center items-center h-screen">
                <div className="w-full max-w-7xl">
                    <div className="grid grid-cols-10 w-full gap-x-2 gap-y-2">
                        <div className="col-span-10">
                            <RoomHeader />
                            {/* <SocketDevTools showTool={true} /> */}
                        </div>
                        <div className="col-span-2">
                            <RoomPlayers />
                        </div>
                        <div className="col-span-6 relative">
                            {playAreaRenderer()}
                            <Canvas />
                        </div>
                        <div className="col-span-2">
                            <LiveChat />
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default RoomRenderer