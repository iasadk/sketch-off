import { Player } from '@/lib/types';
import { create } from 'zustand';
type GAME_STATE = "NOT_STARTED" | "CHOOSING_WORD" | "ROUND_START" | "ROUND_OVER" | "GAME_OVER"
type State = {
    gameState: GAME_STATE,
    is_owner: boolean,
    artistId: string | null,
    players: Player[]
    chats: string[]
}

type Actions = {
    updatePlayers: (players: State["players"]) => void
    updateChats: (msg: string) => void
    updateIsOwner: (isOwner: State["is_owner"]) => void
    updateArtist: (uuid: string) => void
    updateGameState: (gameState: State["gameState"]) => void
}

export const useGameStore = create<State & Actions>()((set) => ({
    gameState: "NOT_STARTED",
    artistId: null,
    is_owner: false,
    chats: [],
    players: [],
    updateChats: (msg) => set((state) => ({
        chats: [...state.chats, msg]
    })),
    updateIsOwner: (is_owner) => set({ is_owner }),
    updatePlayers: (players) => set({ players }),
    updateArtist: (artistId) => set({ artistId }),
    updateGameState: (gameState) => set({ gameState }),

}))