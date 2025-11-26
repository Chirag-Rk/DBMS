// src/components/admin/NewUserModal.tsx
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

type Role = "student" | "guide";

interface Props {
  open: boolean;
  onClose: () => void;
  role: Role;
  onCreated?: () => void;
}

export default function NewUserModal({ open, onClose, role, onCreated }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setName("");
      setEmail("");
      setPassword("");
      setLoading(false);
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("All fields are required");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/auth/register", {
        full_name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        role,
      });
      toast.success(res?.data?.message || "User created successfully");
      onCreated?.();
      onClose();
    } catch (err: any) {
      console.error("create user error", err);
      toast.error(err?.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => (val ? null : onClose())}>
      <DialogContent aria-describedby="new-user-description">
        <DialogHeader>
          <DialogTitle>
            {role === "student" ? "Add New Student" : "Add New Guide"}
          </DialogTitle>
          <DialogDescription id="new-user-description">
            Create a new user account with the details below.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter full name"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Create User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

