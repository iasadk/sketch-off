import { API_BASE_URL } from "@/lib/constants";
import { CreateRoomPayload, CreateRoomResponse, JoinRoomPayload, Response, StartGamePayload } from "@/lib/types";
import axios from "axios";

export const createRoom = async (data: CreateRoomPayload): Promise<Response<CreateRoomResponse>> => {
    const res = await axios.post(`${API_BASE_URL}/room/create`, data);
    return res.data;
}

export const joinRoom = async (data: JoinRoomPayload) => {
    const res = await axios.post(`${API_BASE_URL}/room/join`, data);
    return res.data;
}

export const getRoom = async (code: string): Promise<Response<CreateRoomResponse>> => {
    const res = await axios.get(`${API_BASE_URL}/room/info/${code}`);
    return res.data;
}

export const startGame = async (data: StartGamePayload): Promise<Response<null>> => {
     const res = await axios.post(`${API_BASE_URL}/room/start-game`, data);
    return res.data;
}