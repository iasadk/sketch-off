import z from "zod";
import { COLORS, STROKE_WIDTHS } from "./constants";
export type Tool = "brush" | "fill" | 'eraser';
export type Color = (typeof COLORS)[number];
export type StrokeWidth = (typeof STROKE_WIDTHS)[number];
export type Point = {
    x: number;
    y: number;
}
export type Stroke = {
    tool: Tool,
    color: Color,
    width: StrokeWidth,
    points: Point[]
}


export const CreateFormValidationSchema = z.object({
    room_name: z.string().min(3, { error: 'Must be of min length 3' }).max(20, { error: 'Must be of max length 20', }),
    player_name: z.string().min(3, { error: 'Must be of min length 3' }).max(20, { error: 'Must be of max length 20' }),
})

export type CreateFormType = z.infer<typeof CreateFormValidationSchema>

export type CreateRoomPayload = CreateFormType & {
    unique_player_id: string;
};
export const JoinFormValidationSchema = z.object({
    room_code: z.string().min(6, { error: 'Must be of min length 6' }).max(6, { error: 'Must be of max length 6' }),
    player_name: z.string().min(3, { error: 'Must be of min length 3' }).max(20, { error: 'Must be of max length 20' }),
})

export type JoinFormType = z.infer<typeof JoinFormValidationSchema>
export type JoinRoomPayload = JoinFormType & {
    unique_player_id: string;
}
export type StartGamePayload = {
    unique_player_id: string;
    room_code: string
}
export type Player = {
    uuid: string,
    score: number,
    name: string;
    is_owner: boolean,
    is_guessed: boolean
}
export interface CreateRoomResponse {
    "_id": string,
    "name": string,
    "code": string,
    "max_players": number,
    "players": Player[]
}

export interface Response<T> {
    success: boolean;
    data: T,
    code: number;
    message: string
}

export type validSessionStorageKeys = "ROOM_CODE" | "UUID"
export type GAME_STATE = "NOT_STARTED" | "CHOOSING_WORD" | "ROUND_START" | "ROUND_OVER" | "GAME_OVER" | "CLEAR_CANVAS"
export type CHAT_COLORS = "GREEN" | "ORANGE" | "RED" | "BLACK"

export type GameStateMessageType = {
    type: "GAME_STATE"
    content: {
        game_state: GAME_STATE,
        current_round: number,
        total_rounds: number,
        round_duration: number,
        round_started_at: string | null,
        choose_word_duration: number,
        choose_word_started_at: string | null,
        artist_id: string;
        choosed_word: string | null,
        round_over_started_at: string | null,
        round_over_duration: number
    },
}

export type SelectWordMessageType = {
    type: "SELECT_WORD"
    content: {
       words: string[]
    },
}

export type WordSelectedMessageType = {
    type: "WORD_SELECTED"
    content: {
       word: string
    },
}

export type ChatMessageType = {
    type: "CHAT"
    content: {
        msg: string
        color: CHAT_COLORS
    },
}

export type ClearCanvasType = {
    type: "CLEAR_CANVAS"
    content: {
        msg: string
    },
}

export type DrawMessageType = {
    type: "DRAW"
    content: {
        stokes: Stroke[]
    },
}

export type JoinMessageType = {
    type: "JOIN"
    content: {
        unique_user_id: string
        name: string
    }
}

export type PlayersMessageType = {
    type: "PLAYERS"
    content: {
        players: Player[]
    }
}

export type TestMessageType = {
    type: "TEST"
    content: {
        message: string
    }
}

export type RoundOverMessageType = {
    type: "ROUND_OVER"
    content: {
        prev_choosed_word: string,
    }
}


export const ChatFormValidationSchema = z.object({
    msg: z.string().min(3, { error: 'Must be of min length 3' }).max(50, { error: 'Must be of max length 50' }),
})

export type ChatFormType = z.infer<typeof ChatFormValidationSchema>