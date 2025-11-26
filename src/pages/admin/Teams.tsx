// src/pages/admin/Teams.tsx
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card } from "@/components/ui/card";

type Team = {
  team_id: number;
  team_name: string;
  project_name?: string;
  guide_name?: string | null;
  created_at?: string;
};

export default function Teams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeams = async () => {
    try {
      const res = await api.get("/admin/teams/all");
      setTeams(res.data.teams || []);
    } catch (err) {
      console.error("Failed to load teams", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-semibold mb-6">Teams</h2>

      <Card className="p-6 bg-white/60 backdrop-blur rounded-xl shadow">
        {loading ? (
          <p>Loading...</p>
        ) : teams.length === 0 ? (
          <p>No teams available</p>
        ) : (
          <div className="space-y-4">
            {teams.map((t) => (
              <div key={t.team_id} className="p-4 bg-white rounded-xl shadow border">
                <h3 className="text-xl font-bold">{t.team_name}</h3>
                <p>Project: {t.project_name || "-"}</p>
                <p>Guide: {t.guide_name || "Not assigned"}</p>
                <p className="text-xs text-gray-500">
                  Created: {t.created_at ? new Date(t.created_at).toLocaleString() : "-"}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
