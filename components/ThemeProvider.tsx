"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import bgImage from "@/app/images/background.webp";

import Image from "next/image";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      {children}
      <Image
        src={bgImage}
        alt="background image"
        style={{ objectFit: "cover", zIndex: -1 }}
        priority
        fill
        unoptimized
        className="dark:grayscale absolute top-0 h-full w-1/2"
      />
    </NextThemesProvider>
  );
}
