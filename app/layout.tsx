import { twMerge } from "tailwind-merge";
import "./globals.css";
import { Outfit } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";

const fontFamily = Outfit({ subsets: ["latin"], weight: "variable" });

export const metadata = {
  title: "ImaginAI",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={twMerge(fontFamily.className, "h-full")}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
