import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
import { toast } from "sonner";

export default function GuideTeams() {
  const [teams, setTeams] = useState([]);

  const fetchTeams = async () => {
    try {
      const res = await api.get("/teams/guide"); // Guide-only endpoint
      setTeams(res.data.teams || []);
    } catch (err) {
      console.error("Failed to fetch teams:", err);
      toast.error("Unable to load teams");
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        My Teams
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teams.length === 0 && (
          <p className="text-muted-foreground">No teams assigned yet.</p>
        )}

        {teams.map((team) => (
          <Card key={team.team_id} className="glass-card-hover p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-primary/20 glow-primary">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{team.team_name}</h3>
                <p className="text-sm text-muted-foreground">
                  Project: {team.project_name}
                </p>
              </div>
            </div>

            {team.progress !== undefined && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{team.progress}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary"
                    style={{ width: `${team.progress}%` }}
                  />
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}


