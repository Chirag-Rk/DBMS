// src/hooks/useRealtimeInvalidate.tsx
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket, connectSocket } from "@/lib/socket";

export default function useRealtimeInvalidate() {
  const qc = useQueryClient();

  useEffect(() => {
    const s = connectSocket();
    if (!s) return;

    const onUserCreated = (payload: any) => {
      qc.invalidateQueries(["users"]);
      qc.invalidateQueries(["students"]);
      qc.invalidateQueries(["guides"]);
    };
    const onUserUpdated = (payload: any) => qc.invalidateQueries(["users"]);
    const onTeamCreated = (payload: any) => qc.invalidateQueries(["teams"]);
    const onMilestoneCreated = (payload: any) => qc.invalidateQueries(["milestones"]);

    s.on("user:created", onUserCreated);
    s.on("user:updated", onUserUpdated);
    s.on("team:created", onTeamCreated);
    s.on("milestone:created", onMilestoneCreated);

    return () => {
      s.off("user:created", onUserCreated);
      s.off("user:updated", onUserUpdated);
      s.off("team:created", onTeamCreated);
      s.off("milestone:created", onMilestoneCreated);
    };
  }, [qc]);
}
