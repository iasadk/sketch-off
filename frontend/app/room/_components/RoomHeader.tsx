"use client";

import InviteButton from "@/app/components/InviteButtom";
import { getSessionStorage } from "@/lib/util";
import { useGameStore } from "@/store/room";
import { useEffect, useState } from "react";

const RoomHeader = () => {
  const gameState = useGameStore((state) => state.gameState);
  const totalRounds = useGameStore((state) => state.total_rounds);
  const currentRound = useGameStore((state) => state.current_round);
  const chooseWordStartedAt = useGameStore((state) => state.choose_word_started_at);
  const chooseWordDuration = useGameStore((state) => state.choose_word_duration);
  const roundOverStartedAt = useGameStore((state) => state.round_over_started_at);
  const roundOverDuration = useGameStore((state) => state.round_over_duration);
  const roundStartedAt = useGameStore((state) => state.round_started_at);
  const roundDuration = useGameStore((state) => state.round_duration);
  const choosedWord = useGameStore((state) => state.choosed_word);
  const words = useGameStore((state) => state.words);
  const artistId = useGameStore((state) => state.artistId);
  const [timeLeft, setTimeLeft] = useState(0);

  const isChoosingWord = gameState === "CHOOSING_WORD";
  const isRoundActive = gameState === "ROUND_START";
  const isArtist = artistId === (getSessionStorage("UUID") ?? "")

  const startedAt = isChoosingWord
    ? chooseWordStartedAt
    : isRoundActive ? roundStartedAt : roundOverStartedAt;

  const duration = isChoosingWord
    ? chooseWordDuration
    : isRoundActive ? roundDuration : roundOverDuration;

  const parseIsoTimestamp = (iso: string) => {
    // trim microseconds -> milliseconds: ...880772+00:00 -> ...880+00:00
    const fixed = iso.replace(/(\.\d{3})\d+/, "$1");
    return new Date(fixed).getTime();
  };

  useEffect(() => {
    if (!startedAt || !duration) {
      setTimeLeft(0);
      return;
    }

    const startTime = parseIsoTimestamp(startedAt);

    const updateTimer = () => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, duration - elapsed);
      setTimeLeft(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [startedAt, duration]);

  return (
    <header className="relative flex h-14 w-full items-center rounded-sm bg-white px-3 text-black shadow-sm">

      {/* Timer */}
      <div className="flex items-center gap-3">
        <div
          className={`
            flex h-11 w-11 items-center justify-center
            rounded-full border-2 border-black
            text-xl font-bold
            ${timeLeft <= 10 ? "animate-pulse" : ""}
          `}
        >
          {timeLeft}
        </div>

        <div className="text-lg font-bold">
          Round {currentRound} of {totalRounds}
        </div>
      </div>

      {/* Center */}
      <div className="absolute left-1/2 flex -translate-x-1/2 flex-col items-center">
        <span className="text-xs font-bold tracking-wide">
          {/* {isChoosingWord
            ? "CHOOSE A WORD"
            : isArtist ? "DRAW" : isRoundActive
              ? "GUESS THIS"
              : gameState.replaceAll("_", " ")} */}
          {isArtist ? "DRAW" : isRoundActive
            ? "GUESS THIS"
            : null}
        </span>

        {isRoundActive && (
          <span className="text-lg font-bold tracking-[0.25em]">
            {isArtist ? choosedWord : choosedWord
              ? choosedWord
                .split("")
                .map(() => "_")
                .join(" ")
              : "_ _ _ _ _ _"}
          </span>
        )}
      </div>
      <InviteButton key={"Invite Button"} />
    </header>
  );
};

export default RoomHeader;