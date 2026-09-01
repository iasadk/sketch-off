"use client";

import { SOCKET_BASE_URL } from "@/lib/constants";
import {
  ChatMessageType,
  ClearCanvasType,
  DrawMessageType,
  GameStateMessageType,
  JoinMessageType,
  PlayersMessageType,
  RoundOverMessageType,
  SelectWordMessageType,
  TestMessageType,
  WordSelectedMessageType,
} from "@/lib/types";
import { getSessionStorage } from "@/lib/util";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";


type MessageMap = {
  GAME_STATE: GameStateMessageType;
  SELECT_WORD: SelectWordMessageType
  WORD_SELECTED: WordSelectedMessageType
  CHAT: ChatMessageType;
  DRAW: DrawMessageType;
  JOIN: JoinMessageType;
  PLAYERS: PlayersMessageType;
  ROUND_OVER: RoundOverMessageType;
  CLEAR_CANVAS: ClearCanvasType;
  TEST: TestMessageType;
};

type MessageType = keyof MessageMap;

type Message = MessageMap[MessageType];

type MessageHandler<T extends MessageType> = (
  message: MessageMap[T]
) => void;


type SocketContextType = {
  socket: WebSocket | null;
  sendMessage: (message: Message) => void;
  isReady: boolean;

  subscribe: <T extends MessageType>(
    type: T,
    handler: MessageHandler<T>
  ) => () => void;
};

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({
  children,
  roomCode,
}: {
  children: React.ReactNode;
  roomCode: string;
}) => {
  const listenersRef = useRef(
    new Map<MessageType, Set<MessageHandler<MessageType>>>()
  );

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isSocketReady, setIsSocketReady] = useState(false);

  const sendMessage = (message: Message) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;

    socket.send(JSON.stringify(message));
  };

  const subscribe = <T extends MessageType>(
    type: T,
    handler: MessageHandler<T>
  ) => {
    const listeners = listenersRef.current;

    if (!listeners.has(type)) {
      listeners.set(type, new Set());
    }

    /*
     * MessageHandler<T> is compatible with the actual event type,
     * but TypeScript cannot preserve that relationship inside Map.
     */
    const typedListeners = listeners.get(type)!;

    typedListeners.add(
      handler as MessageHandler<MessageType>
    );

    return () => {
      typedListeners.delete(
        handler as MessageHandler<MessageType>
      );
    };
  };


  useEffect(() => {
    const uniqueUserId = getSessionStorage<string>("UUID");

    const ws = new WebSocket(
      `${SOCKET_BASE_URL}/${roomCode}`
    );

    setSocket(ws);

    ws.onopen = () => {
      console.log("🟢 WebSocket connected");

      setIsSocketReady(true);

      ws.send(
        JSON.stringify({
          type: "TEST",
          content: {
            message: "Hello from client",
          },
        })
      );

      if (uniqueUserId) {
        ws.send(
          JSON.stringify({
            type: "JOIN",
            content: {
              unique_user_id: uniqueUserId,
            },
          })
        );
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
        console.error(
          "Invalid WebSocket message:",
          error
        );
      }
    };

    // ws.onclose = () => {
    //   setIsSocketReady(false);
    //   console.log("🔴 WebSocket disconnected");
    // };

    ws.onclose = (event) => {
      console.log("🔴 WebSocket disconnected", {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean,
      });

      setIsSocketReady(false);
    };

    ws.onerror = (error) => {
      setIsSocketReady(false);
      console.error("❌ WebSocket error:", error);
    };

    return () => {
      ws.close();
      setSocket(null);
      setIsSocketReady(false);
    };
  }, [roomCode]);


  return (
    <SocketContext.Provider
      value={{
        socket,
        sendMessage,
        isReady: isSocketReady,
        subscribe,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error(
      "useSocket must be used within SocketProvider"
    );
  }

  return context;
};
