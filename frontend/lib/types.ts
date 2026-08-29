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
export type Player = {
    uuid: string,
    score: number,
    name: string;
    is_owner: boolean
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