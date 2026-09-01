"use client";

import Image from "next/image";
import Link from "next/link";


type Props = {
    href: string;
    label?: string;
};

const GithubButton = ({ href, label = "View on GitHub" }: Props) => {
    return (
        <Link
            target="_blank"
            href={href}
            rel="noopener noreferrer"
            className="
            absolute right-10 top-2 inline-flex items-center gap-2
            rounded-full border border-white/15
            bg-black/80 px-4 py-2
            text-xs font-semibold text-white
            transition-colors
            hover:bg-black
            "
        >
            <Image
                src="/assets/github-logo.png"
                alt="GitHub"
                width={16}
                height={16}
            />
            {label}
        </Link>
    );
};

export default GithubButton;