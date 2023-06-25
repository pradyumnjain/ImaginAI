"use client";

import routes from "@/api/constants";
import { cn } from "@/lib/utils";
import { useQuery } from "react-query";

export default function HealthCheck() {
  const { data } = useQuery<(typeof routes)["healthCheck"]["value"]>(
    "healthCheck",
    () => {
      return fetch(`/${routes.healthCheck.path}`).then((res) => res.json());
    }
  );
  return (
    <div className="text-sm bg-black/5 dark:bg-white/10 max-w-max px-3 py-1.5 flex items-center gap-2 rounded-full border border-black/10 dark:border-white/50 absolute top-2 right-4">
      API Health{" "}
      <div
        className={cn(
          "rounded-full h-2 w-2 bg-gray-500 animate-pulse",
          data?.status === "ok" ? "bg-green-500" : "bg-red-500"
        )}
      />
    </div>
  );
}
