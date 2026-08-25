"use client";

import { SOCKET_BASE_URL } from "@/lib/constants";
import {
    createContext,
    useContext,
    useEffect,
    useRef,
} from "react";

type SocketContextType = {
    socket: WebSocket | null;
};

const SocketContext = createContext<SocketContextType>({
    socket: null,
});

export const SocketProvider = ({
    children,
    roomCode,
}: {
    children: React.ReactNode;
    roomCode: string;
}) => {
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const socket = new WebSocket(
            `${SOCKET_BASE_URL}/${roomCode}`
        );

        socketRef.current = socket;

        socket.onopen = () => {
            console.log("🟢 WebSocket connected");
        };

        socket.onclose = () => {
            console.log("🔴 WebSocket disconnected");
        };

        socket.onerror = (error) => {
            console.error("❌ WebSocket error:", error);
        };

        return () => {
            socket.close();
            socketRef.current = null;
        };
    }, [roomCode]);

    return (
        <SocketContext.Provider
            value={{
                socket: socketRef.current,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);

    if (!context) {
        throw new Error("useSocket must be used within SocketProvider");
    }

    return context;
};