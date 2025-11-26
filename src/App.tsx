// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

import Login from "./pages/Login";
import Layout from "./components/Layout";

// ADMIN
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStudents from "./pages/admin/Students";
import AdminGuides from "./pages/admin/Guides";
import AdminTeams from "./pages/admin/Teams";
import AdminMilestones from "./pages/admin/Milestones";
import AdminReports from "./pages/admin/Reports";

// GUIDE
import GuideDashboard from "./pages/guide/GuideDashboard";
import GuideTeams from "./pages/guide/Teams";
import GuideSubmissions from "./pages/guide/Submissions";
import GuideEvaluations from "./pages/guide/Evaluations";

// STUDENT
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentMilestones from "./pages/student/Milestones";
import StudentSubmissions from "./pages/student/Submissions";
import StudentFeedback from "./pages/student/Feedback";

import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;

  return <Layout>{children}</Layout>;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Route */}
      <Route
        path="/"
        element={
          user ? <Navigate to={`/${user.role}`} replace /> : <Login />
        }
      />

      {/* ADMIN ROUTES */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/students"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminStudents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/guides"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminGuides />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/teams"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminTeams />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/milestones"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminMilestones />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminReports />
          </ProtectedRoute>
        }
      />

      {/* GUIDE ROUTES */}
      <Route
        path="/guide"
        element={
          <ProtectedRoute allowedRoles={["guide"]}>
            <GuideDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/guide/teams"
        element={
          <ProtectedRoute allowedRoles={["guide"]}>
            <GuideTeams />
          </ProtectedRoute>
        }
      />
      <Route
        path="/guide/submissions"
        element={
          <ProtectedRoute allowedRoles={["guide"]}>
            <GuideSubmissions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/guide/evaluations"
        element={
          <ProtectedRoute allowedRoles={["guide"]}>
            <GuideEvaluations />
          </ProtectedRoute>
        }
      />

      {/* STUDENT ROUTES */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/milestones"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentMilestones />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/submissions"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentSubmissions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/feedback"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentFeedback />
          </ProtectedRoute>
        }
      />

      {/* COMMON */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute allowedRoles={["admin", "guide", "student"]}>
            <Settings />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
