'use client'
import { useEffect, useState,useMemo } from "react";
import { getAllUserProfiles } from "../../../../server/actions/onboarding";

import type {UserProfileFlat} from "../../../types/index";

export function useDataConfig() {
    const [profiles, setProfiles] = useState<UserProfileFlat[]>([]);
      const [error, setError] = useState<string | null>(null);
    useEffect(() => {
    (async () => {
      try {
        const data = await getAllUserProfiles();
          // 🔍 Log the fetched data
                console.log("useDataConfig - fetched data:", data);
                console.log("useDataConfig - data length:", data.length);
                      
        setProfiles(data);
      } catch (err) {
        setError(
          `Error loading profiles: ${err instanceof Error ? err.message : "Unknown error"}`
        );
      } 
    })();
  }, []);
    const allKeys = useMemo(() => {
    const keys = new Set<string>();
    for (const p of profiles) {
      const blob = p.profile_data || {};
      for (const k of Object.keys(blob)) {
        if (!/^step_\d+_completed$/i.test(k)) keys.add(k);
      }
    }
    return Array.from(keys);
  }, [profiles]);
    return {
       profiles,
        allKeys,
        error
    }
}