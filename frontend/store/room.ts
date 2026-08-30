import { CHAT_COLORS, GAME_STATE, Player } from '@/lib/types';
import { create } from 'zustand';
type State = {
    gameState: GAME_STATE,
    current_round: number,
    total_rounds: number,
    choose_word_started_at: string | null,
    choose_word_duration: number,
    round_started_at: string | null
    round_duration: number,
    is_owner: boolean,
    artistId: string | null,
    players: Player[]
    chats: { msg: string, color: CHAT_COLORS }[],
    words: string[],
    choosed_word: string | null
}

type Actions = {
    updatePlayers: (players: State["players"]) => void
    updateChats: (msg: string, color: CHAT_COLORS) => void
    updateIsOwner: (isOwner: State["is_owner"]) => void
    updateArtist: (uuid: string) => void
    updateGameState: (gameState: State["gameState"]) => void
    updateWordsList: (words: State["words"]) => void
    updateChoosedWord: (word: State["choosed_word"]) => void
    updateChooseWordStartedAt: (startedAt: State["choose_word_started_at"]) => void
    updateChooseWordDuration: (duration: State["choose_word_duration"]) => void
    updateRoundStartedAt: (startedAt: State["round_started_at"]) => void
    updateRoundDuration: (duration: State["round_duration"]) => void
    updateCurrentRound: (duration: State["current_round"]) => void
    updateTotalRounds: (duration: State["total_rounds"]) => void
}

export const useGameStore = create<State & Actions>()((set) => ({
    gameState: "NOT_STARTED",
    current_round: 0,
    total_rounds: 3,
    artistId: null,
    is_owner: false,
    chats: [],
    players: [],
    words: [],
    choosed_word: null,
    choose_word_started_at: null,
    choose_word_duration: 0,

    round_started_at: null,
    round_duration: 0,
    updateChats: (msg, color) => set((state) => ({
        chats: [...state.chats, { msg, color }]
    })),
    updateIsOwner: (is_owner) => set({ is_owner }),
    updatePlayers: (players) => set({ players }),
    updateArtist: (artistId) => set({ artistId }),
    updateGameState: (gameState) => set({ gameState }),
    updateWordsList: (words) => set({ words }),
    updateChoosedWord: (choosed_word) => set({ choosed_word }),
    updateChooseWordStartedAt: (choose_word_started_at) => set({ choose_word_started_at }),
    updateChooseWordDuration: (choose_word_duration) => set({ choose_word_duration }),
    updateRoundStartedAt: (round_started_at) => set({ round_started_at }),
    updateRoundDuration: (round_duration) => set({ round_duration }),
    updateCurrentRound: (current_round) => set({ current_round }),
    updateTotalRounds: (total_rounds) => set({ total_rounds }),

}))