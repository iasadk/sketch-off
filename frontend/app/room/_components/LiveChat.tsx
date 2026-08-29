"use client";

import { useSocket } from "@/provider/websocket";
import { useGameStore } from "@/store/room";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";

const LiveChat = () => {
  const { chats, updateChat } = useGameStore(
    useShallow((state) => ({
      chats: state.chats,
      updateChat: state.updateChats,
    }))
  );

  const { subscribe } = useSocket();

  useEffect(() => {
    const unsubscribe = subscribe("CHAT", (message) => {
      const { color, msg } = message.content;

      updateChat(msg, color);
    });

    return unsubscribe;
  }, [subscribe, updateChat]);

  return (
    <div className="flex h-full w-full flex-col justify-end overflow-hidden rounded-sm bg-white p-2">
      <div
        className="
          flex
          max-h-full
          flex-col
          overflow-y-auto
          text-sm
          font-semibold
          scrollbar-thin
          scrollbar-thumb-gray-300
          scrollbar-track-transparent
          hover:scrollbar-thumb-gray-400
        "
      >
        {chats.map((chat, index) => (
          <p
            key={`${chat.msg}-${index}`}
            style={{ color: chat.color }}
            className="break-words px-1 py-0.5 text-left"
          >
            {chat.msg}
          </p>
        ))}
      </div>
    </div>
  );
};

export default LiveChat;