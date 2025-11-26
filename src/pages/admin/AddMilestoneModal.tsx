// src/components/admin/AddMilestoneModal.tsx
import React, { useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

export default function AddMilestoneModal({ open, onClose, onCreated }: { open:boolean, onClose:()=>void, onCreated?:()=>void }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [due, setDue] = useState("");
  const [loading, setLoading] = useState(false);
  if (!open) return null;

  const create = async () => {
    setLoading(true);
    try {
      await api.post("/admin/milestones/create", { title, description: desc, due_date: due });
      toast.success("Milestone created");
      onCreated?.();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="bg-white rounded-lg p-6 w-full max-w-md z-10">
        <h3 className="text-lg font-semibold mb-4">Add Milestone</h3>
        <div className="space-y-3">
          <input className="input" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
          <textarea className="input" placeholder="Description" value={desc} onChange={e=>setDesc(e.target.value)} />
          <input className="input" type="date" value={due} onChange={e=>setDue(e.target.value)} />
          <div className="flex gap-2 justify-end">
            <button className="btn" onClick={onClose} disabled={loading}>Cancel</button>
            <button className="btn btn-primary" onClick={create} disabled={loading}>{loading ? "Saving..." : "Create"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
