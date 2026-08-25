import { API_BASE_URL } from "@/lib/constants"
import { CreateFormType, CreateRoomResponse, JoinFormType, Response } from "@/lib/types";
import axios from "axios"

export const createRoom = async (data: CreateFormType): Promise<Response<CreateRoomResponse>> => {
    const res = await axios.post(`${API_BASE_URL}/room/create`, data);
    return res.data;
}

export const joinRoom = async (data: JoinFormType) => {
    const res = await axios.post(`${API_BASE_URL}/room/create`, data);
    return res.data;
}