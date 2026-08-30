"use client";

import { getSessionStorage } from "@/lib/util";
import { useSocket } from "@/provider/websocket";
import { useGameStore } from "@/store/room";
import { useShallow } from "zustand/shallow";

type Props = {};

const ChooseWords = (props: Props) => {
  const { words, artistId } = useGameStore(useShallow((state) => ({
    words: state.words,
    artistId: state.artistId,
  })));
  const playerUniqueId: string = getSessionStorage("UUID") ?? ""
  const isArtist = playerUniqueId === artistId
  const { sendMessage } = useSocket()
  const handleWordSelect = (word: string) => {
    sendMessage({ "type": "WORD_SELECTED", "content": { word } })
  };

  return (
    <div className="absolute inset-0 z-50 flex h-full w-full flex-col items-center justify-center bg-black/70">
      {isArtist ? <div className="flex flex-col items-center">
        <h2 className="text-3xl font-bold tracking-wide text-white">
          Choose a Word
        </h2>

        <p className="mt-2 text-sm font-medium text-gray-300">
          Pick a word to draw
        </p>

        <div className="mt-8 flex gap-4">
          {words.map((word) => (
            <button
              key={word}
              type="button"
              onClick={() => handleWordSelect(word)}
              className="
                min-w-32 rounded-md
                border-2 border-white/70
                bg-white px-6 py-4
                text-lg font-bold uppercase
                tracking-wide text-black
                transition-all duration-200
                hover:-translate-y-1
                hover:border-white
                hover:bg-gray-100
                hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]
                active:translate-y-0
              "
            >
              {word}
            </button>
          ))}
        </div>

        <p className="mt-6 text-xs font-medium tracking-wide text-gray-400">
          Select one word to start the round
        </p>
      </div> : <WaitingToChooseWord />}
    </div>
  );
};

const WaitingToChooseWord = () => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/30">
        <span className="text-3xl animate-pulse">✏️</span>
      </div>

      <h2 className="text-2xl font-bold tracking-wide text-white">
        A player is choosing a word
      </h2>

      <p className="mt-2 text-sm font-medium text-gray-300">
        Get ready to guess!
      </p>

      <div className="mt-5 flex gap-1">
        <span className="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:-0.3s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:-0.15s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-white" />
      </div>
    </div>
  )
}
export default ChooseWords;