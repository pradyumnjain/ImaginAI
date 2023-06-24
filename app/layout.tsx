import { twMerge } from "tailwind-merge";
import "./globals.css";
import { Outfit } from "next/font/google";

const fontFamily = Outfit({ subsets: ["latin"] });

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
    <html lang="en" className="h-full">
      <body className={twMerge(fontFamily.className, "h-full")}>
        {children}
      </body>
    </html>
  );
}
