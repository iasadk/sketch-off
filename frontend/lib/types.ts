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
    room_name: z.string().optional(),
    // .min(3, { error: 'Must be of min length 3' }).max(20, { error: 'Must be of max length 20', }),
    player_name: z.string().optional()
    // .min(3, { error: 'Must be of min length 3' }).max(20, { error: 'Must be of max length 20' }),
})

export type CreateFormType = z.infer<typeof CreateFormValidationSchema>


export const JoinFormValidationSchema = z.object({
    room_code: z.string().min(6, { error: 'Must be of min length 6' }).max(6, { error: 'Must be of max length 6' }),
    player_name: z.string().min(3, { error: 'Must be of min length 3' }).max(20, { error: 'Must be of max length 20' }),
})

export type JoinFormType = z.infer<typeof JoinFormValidationSchema>

export type Player = { 
    score: number,
    name: string
}
export interface CreateRoomResponse {
    "_id": string,
    "name": string,
    "code": string,
    "max_players": number,
    "players": Player[]
}