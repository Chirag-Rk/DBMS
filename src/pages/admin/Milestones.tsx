// src/pages/admin/Milestones.tsx
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card } from "@/components/ui/card";
import { getSocket } from "@/lib/socket";

export default function Milestones() {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMilestones = async () => {
    try {
      const res = await api.get("/admin/milestones/all"); // FIXED ROUTE
      setMilestones(res.data.milestones || []);
    } catch (err) {
      console.error("Failed to fetch milestones:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMilestones();

    const socket = getSocket();
    socket?.on("milestone:created", loadMilestones);

    return () => socket?.off("milestone:created", loadMilestones);
  }, []);

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Milestones</h2>

      {loading ? (
        <p>Loading...</p>
      ) : milestones.length === 0 ? (
        <p>No milestones found</p>
      ) : (
        <ul className="space-y-3">
          {milestones.map((m: any) => (
            <li key={m.milestone_id} className="border p-3 rounded-md">
              <strong>{m.title}</strong>
              <p>Description: {m.description || "-"}</p>
              <p>Due: {m.due_date}</p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
