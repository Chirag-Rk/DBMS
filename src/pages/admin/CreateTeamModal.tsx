// src/components/admin/CreateTeamModal.tsx
import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

export default function CreateTeamModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}) {
  const [name, setName] = useState("");
  const [project, setProject] = useState("");
  const [guideId, setGuideId] = useState<number | "">("");
  const [guides, setGuides] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    (async () => {
      try {
        // USE THIS — guaranteed working
        const res = await api.get("/users?role=guide");
        setGuides(res.data || []);
      } catch (e) {
        console.error("Failed to load guides:", e);
      }
    })();
  }, [open]);

  if (!open) return null;

  const create = async () => {
    if (!name || !project) {
      toast.error("Enter team name & project name");
      return;
    }

    setLoading(true);
    try {
      await api.post("/admin/teams/create", {
        team_name: name,
        project_name: project,
        guide_id: guideId || null,
      });

      toast.success("Team created");
      onCreated?.();
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create team");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="bg-white rounded-xl p-6 w-full max-w-xl z-10">
        <h3 className="text-xl font-semibold mb-4">Create Team</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            className="input col-span-2"
            placeholder="Team name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="input"
            placeholder="Project name"
            value={project}
            onChange={(e) => setProject(e.target.value)}
          />

          <select
            className="input"
            value={guideId}
            onChange={(e) =>
              setGuideId(e.target.value ? Number(e.target.value) : "")
            }
          >
            <option value="">Select guide (optional)</option>
            {guides.map((g) => (
              <option key={g.user_id} value={g.user_id}>
                {g.full_name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button className="btn" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={create}
            disabled={loading}
          >
            {loading ? "Saving..." : "Create Team"}
          </button>
        </div>
      </div>
    </div>
  );
}
