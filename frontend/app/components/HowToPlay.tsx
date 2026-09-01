"use client";

import Image from "next/image";
import { PencilLine } from "lucide-react";

type Step = {
  title: string;
  description: string;
  image?: string;
};

const STEPS: Step[] = [
  {
    title: "Draw your word",
    description: "Try to draw your chosen word! No spelling!",
  },
  {
    title: "Guess the drawing",
    description: "Type your guess in the chat before time runs out!",
  },
  {
    title: "Earn points",
    description:
      "On correct guesses, the guesser earns points.",
  },
  {
    title: "Take turns",
    description: "Everyone gets a turn to draw — most points wins!",
  },
];

const HowToPlay = () => {
  return (
    <div className="w-full max-w-md rounded-2xl bg-[#1447e6] p-6 text-white">
      {/* Header */}
      <div className="mb-6 flex items-center gap-2">
        <PencilLine className="h-6 w-6 -rotate-12" />
        <h2 className="text-2xl font-bold">How to play</h2>
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-5">
        {STEPS.map((step, index) => (
          <div key={step.title} className="flex gap-3">
            {/* Step number */}
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15 text-sm font-bold">
              {index + 1}
            </div>

            <div className="flex-1">
              <p className="font-semibold">{step.title}</p>
              <p className="text-sm text-white/80">{step.description}</p>

              {step.image && (
                <div className="relative mt-2 h-32 w-full overflow-hidden rounded-lg bg-white/10">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowToPlay;