import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function CreateTeamModal({ onClose, onCreated }) {
  const [teamName, setTeamName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [guideId, setGuideId] = useState<number | null>(null);
  const [guides, setGuides] = useState<any[]>([]);
  const [loadingGuides, setLoadingGuides] = useState(true);

  useEffect(() => {
    const loadGuides = async () => {
      setLoadingGuides(true);
      try {
        // call without '/api' since api baseURL already has it
        const res = await api.get("/users?role=guide");
        const data = res?.data;
        const list =
          Array.isArray(data) ||
          Array.isArray(data?.users) ||
          Array.isArray(data?.data)
            ? data.users || data.data
            : [];
        setGuides(list);
      } catch (err) {
        console.error("Failed to load guides:", err);
      } finally {
        setLoadingGuides(false);
      }
    };

    loadGuides();
  }, []);

  const createTeam = async () => {
    try {
      // remove /admin or /api prefix: api.post("/teams/create")
      await api.post("/teams/create", {
        team_name: teamName,
        project_name: projectName,
        guide_id: guideId,
      });

      onCreated();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl w-[600px]">
      <h2 className="text-xl font-bold mb-4">Create Team</h2>

      <input
        placeholder="Team name"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        className="border p-2 rounded w-full mb-3"
      />

      <input
        placeholder="Project name"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        className="border p-2 rounded w-full mb-3"
      />

      <label className="font-medium">Select guide (optional)</label>
      <select
        value={guideId ?? ""}
        onChange={(e) => setGuideId(e.target.value ? Number(e.target.value) : null)}
        className="border p-2 w-full rounded mb-4"
      >
        <option value="">Select guide (optional)</option>

        {loadingGuides ? (
          <option>Loading...</option>
        ) : guides.length === 0 ? (
          <option>No guides available</option>
        ) : (
          guides.map((g: any) => (
            <option key={g.user_id ?? g.id} value={g.user_id ?? g.id}>
              {g.full_name ?? g.name ?? g.email}
            </option>
          ))
        )}
      </select>

      <div className="flex justify-end gap-4">
        <button onClick={onClose}>Cancel</button>
        <button onClick={createTeam} className="text-blue-600">
          Create Team
        </button>
      </div>
    </div>
  );
}
