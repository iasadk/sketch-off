import { API_BASE_URL } from "@/lib/constants"
import { CreateFormType, CreateRoomPayload, CreateRoomResponse, JoinFormType, Response } from "@/lib/types";
import axios from "axios"

export const createRoom = async (data: CreateRoomPayload): Promise<Response<CreateRoomResponse>> => {
    const res = await axios.post(`${API_BASE_URL}/room/create`, data);
    return res.data;
}

export const joinRoom = async (data: JoinFormType) => {
    const res = await axios.post(`${API_BASE_URL}/room/create`, data);
    return res.data;
}

export const getRoom = async (code: string): Promise<Response<CreateRoomResponse>> => {
    const res = await axios.get(`${API_BASE_URL}/room/info/${code}`);
    return res.data;
}