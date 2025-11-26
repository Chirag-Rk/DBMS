// src/pages/admin/AdminDashboard.tsx
import React, { useEffect, useState } from "react";
import { Users, UsersRound, FolderKanban, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import NewUserModal from "@/pages/admin/NewUserModal";
import CreateTeamModal from "@/pages/admin/CreateTeamModal";
import AddMilestoneModal from "@/pages/admin/AddMilestoneModal";

import api from "@/lib/api";
import { connectSocket, getSocket } from "@/lib/socket";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ students: 0, guides: 0, teams: 0, projects: 0 });

  const [openStudent, setOpenStudent] = useState(false);
  const [openGuide, setOpenGuide] = useState(false);
  const [openTeam, setOpenTeam] = useState(false);
  const [openMilestone, setOpenMilestone] = useState(false);

  // ✅ FIXED — fetchStats moved OUTSIDE useEffect
  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/stats"); // FIXED URL
      setStats(res.data);
    } catch (e) {
      console.error("fetchStats error", e);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    const socket = connectSocket();

    socket.on("notification:new", (payload: any) => {
      fetchStats();
      toast.success(payload?.message || "Notification received");
    });

    return () => {
      const s = getSocket();
      if (s) s.off("notification:new");
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Students</p>
                <h3 className="text-3xl font-bold">{stats.students}</h3>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Guides</p>
                <h3 className="text-3xl font-bold">{stats.guides}</h3>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500">
                <UsersRound className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Teams</p>
                <h3 className="text-3xl font-bold">{stats.teams}</h3>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500">
                <FolderKanban className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Ongoing Projects</p>
                <h3 className="text-3xl font-bold">{stats.projects}</h3>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
                <Target className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-white/5">No recent activities loaded</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" onClick={() => setOpenStudent(true)}>
              Add New Student
            </Button>
            <Button className="w-full" onClick={() => setOpenGuide(true)}>
              Add New Guide
            </Button>
            <Button className="w-full" onClick={() => setOpenTeam(true)}>
              Create Team
            </Button>
            <Button className="w-full" onClick={() => setOpenMilestone(true)}>
              Add Milestone
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <NewUserModal open={openStudent} onClose={() => setOpenStudent(false)} role="student" onCreated={fetchStats} />
      <NewUserModal open={openGuide} onClose={() => setOpenGuide(false)} role="guide" onCreated={fetchStats} />
      <CreateTeamModal open={openTeam} onClose={() => setOpenTeam(false)} onCreated={fetchStats} />
      <AddMilestoneModal open={openMilestone} onClose={() => setOpenMilestone(false)} onCreated={fetchStats} />
    </div>
  );
}
