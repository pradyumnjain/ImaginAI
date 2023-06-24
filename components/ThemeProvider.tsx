"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

import Image from "next/image";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      {children}
      <Image
        src="https://images.unsplash.com/photo-1611677761649-552e1a711e46?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80"
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
