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

type MessageType = "DRAW" | "JOIN" | "TEST" |  "PLAYERS"
type Message = {
    type: MessageType,
    content: Record<string, unknown>
}
type MessageHandler = (message: Message) => void
type SocketContextType = {
    socket: WebSocket | null;
    sendMessage: (message: Message) => void;
    isReady: boolean;
    subscribe: (type: MessageType, handler: MessageHandler) => () => void;

};

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({
    children,
    roomCode,
}: {
    children: React.ReactNode;
    roomCode: string;
}) => {
    const listenersRef = useRef(new Map<MessageType, Set<MessageHandler>>());
    const [socket, setSocket] = useState<WebSocket | null>(null)
    const [isSocketReady, setIsSocketReady] = useState(false)
    const sendMessage = (message: Message) => {
        if (!socket || socket.readyState !== WebSocket.OPEN) return;
        socket.send(JSON.stringify(message))
    }


    const subscribe = (type: MessageType, handler: MessageHandler) => {
        const listeners = listenersRef.current;

        if (listeners.has(type)) {
            listeners.get(type)!.add(handler)
        } else {
            listeners.set(type, new Set())
        }

        const unsubscribe = () => listeners.get(type)?.delete(handler)
        return unsubscribe
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
                console.log({ type: "JOIN", content: { unique_user_id } })
                ws.send(JSON.stringify({ type: "JOIN", content: { unique_user_id } }))
            }
        };

        ws.onmessage = (event) => {
            try {
                const data: Message = JSON.parse(event.data);

                const handlers = listenersRef.current.get(data.type);

                handlers?.forEach((handler) => {
                    handler(data);
                });
            } catch (error) {
                console.error("Invalid WebSocket message:", error);
            }
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
            setSocket(null)
        };
    }, [roomCode]);

    return (
        <SocketContext.Provider
            value={{
                socket,
                sendMessage: sendMessage,
                isReady: isSocketReady,
                subscribe
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