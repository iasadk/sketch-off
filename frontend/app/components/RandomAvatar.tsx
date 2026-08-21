"use client";

type RandomAvatarProps = {
  seed?: string;
  size?: number;
};

export default function RandomAvatar({
  seed,
  size = 48,
}: RandomAvatarProps) {
  const avatarSeed =
    seed ?? Math.random().toString(36).substring(2);

  const avatarUrl = `https://api.dicebear.com/9.x/bottts/svg?seed=${avatarSeed}`;

  return (
    <img
      src={avatarUrl}
      alt="Player avatar"
      width={size}
      height={size}
      className="rounded-full"
    />
  );
}