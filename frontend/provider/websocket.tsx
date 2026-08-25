"use client";

import { SOCKET_BASE_URL } from "@/lib/constants";
import { getSessionStorage } from "@/lib/util";
import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

type SocketContextType = {
    socket: WebSocket | null;
    sendMessage: (message: Message) => void,
    isReady: boolean

};
type MessageType = "DRAW"  | "JOIN" |  "TEST"
type Message = {
    type: MessageType,
    message: Record<string, unknown>
}
const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({
    children,
    roomCode,
}: {
    children: React.ReactNode;
    roomCode: string;
}) => {
    const socketRef = useRef<WebSocket | null>(null);
    const [socket, setSocket] = useState<WebSocket | null>(null)
    const [isSocketReady, setIsSocketReady] = useState(false)
    const sendMessage = (message: Message) => {
        if (!socket || socket.readyState !== WebSocket.OPEN) return;
        socket.send(JSON.stringify(message))
    }


    useEffect(() => {
        const unique_user_id = getSessionStorage<string>("UUID")
        const ws = new WebSocket(
            `${SOCKET_BASE_URL}/${roomCode}`
        );

        setSocket(ws);

        ws.onopen = () => {
            console.log("🟢 WebSocket connected");
            setIsSocketReady(true)
            ws.send(JSON.stringify({
                type: "TEST",
                message: "Hello from client"
            }));

            if (unique_user_id) {
                console.log({ type: "JOIN", message: { unique_user_id } })
                ws.send(JSON.stringify({ type: "JOIN", message: { unique_user_id } }))
            }
        };

        ws.onmessage = (event) => {
            console.log(event)
        };
        ws.onclose = () => {
            setIsSocketReady(false)
            console.log("🔴 WebSocket disconnected");
        };

        ws.onerror = (error) => {
            setIsSocketReady(false)
            console.error("❌ WebSocket error:", error);
        };

        return () => {
            ws.close();
            socketRef.current = null;
        };
    }, [roomCode]);

    return (
        <SocketContext.Provider
            value={{
                socket,
                sendMessage: sendMessage,
                isReady: isSocketReady
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