"use client";

import { useCallback, useEffect, useState } from "react";
import type { PlanName } from "@/lib/plan";

export interface PlanInfo {
  plan: PlanName;
  isPro: boolean;
  isAuthenticated: boolean;
  freeLimit: number;
  used: number;
  remaining: number;
  demoProAllowed: boolean;
}

const EMPTY: PlanInfo = {
  plan: "free",
  isPro: false,
  isAuthenticated: false,
  freeLimit: 1,
  used: 0,
  remaining: 1,
  demoProAllowed: false,
};

export function usePlan() {
  const [info, setInfo] = useState<PlanInfo>(EMPTY);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async (): Promise<PlanInfo | null> => {
    try {
      const res = await fetch("/api/me/plan", { cache: "no-store" });
      if (!res.ok) return null;
      const data = (await res.json()) as PlanInfo;
      if (typeof data?.freeLimit === "number") {
        setInfo(data);
        return data;
      }
      return null;
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { info, loading, refresh };
}
