// src/components/admin/AddMilestoneModal.tsx

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { toast } from "sonner";

interface Team {
  team_id: number;
  team_name: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export default function AddMilestoneModal({ open, onClose, onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [teamId, setTeamId] = useState<number | "">("");
  
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch teams when modal opens
  useEffect(() => {
    if (open) {
      loadTeams();
    } else {
      setTitle("");
      setDescription("");
      setDueDate("");
      setTeamId("");
    }
  }, [open]);

  const loadTeams = async () => {
    try {
      const res = await api.get("/teams");
      setTeams(res.data);
    } catch (err) {
      console.error("Failed to fetch teams:", err);
      toast.error("Failed to load teams");
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) return toast.error("Please enter a milestone title");
    if (!dueDate) return toast.error("Please select a due date");
    if (!teamId) return toast.error("Please select a team");

    setLoading(true);

    try {
      const res = await api.post("/milestones/create", {
        title: title.trim(),
        description: description.trim(),
        due_date: dueDate,
        team_id: teamId,
      });

      toast.success(res?.data?.message || "Milestone created");
      onCreated?.();
      onClose();
    } catch (err: any) {
      console.error("create milestone error", err);
      toast.error(err?.response?.data?.error || "Failed to create milestone");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => (val ? null : onClose())}>
      <DialogContent aria-describedby="add-milestone-description">
        <DialogHeader>
          <DialogTitle>Add Milestone</DialogTitle>
          <DialogDescription id="add-milestone-description">
            Add a new milestone for a specific team.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div>
            <Label>Description</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div>
            <Label>Due Date</Label>
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>

          <div>
            <Label>Select Team</Label>
            <select
              className="border p-2 rounded w-full"
              value={teamId}
              onChange={(e) => setTeamId(Number(e.target.value))}
            >
              <option value="">-- Select Team --</option>
              {teams.map((team) => (
                <option key={team.team_id} value={team.team_id}>
                  {team.team_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
