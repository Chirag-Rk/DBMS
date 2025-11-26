// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlassCard } from "@/components/GlassCard";
import { Shield, GraduationCap, Users } from "lucide-react";
import { toast } from "sonner";
import campusBg from "@/assets/campus-bg.jpg";

import api from "@/lib/api";
import connectSocket, { getSocket } from "@/lib/socket";   // ✅ FIXED
import { useAuth } from "@/contexts/AuthContext";

type UserRole = "admin" | "guide" | "student";

const roleIcons = {
  student: GraduationCap,
  guide: Users,
  admin: Shield,
};

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let response;

      if (isLogin) {
        response = await api.post("/auth/login", {
          email: formData.email,
          password: formData.password,
          role: selectedRole,
        });
        toast.success("Login successful!");
      } else {
        response = await api.post("/auth/register", {
          full_name: formData.name,
          email: formData.email,
          password: formData.password,
          role: selectedRole,
        });
        toast.success("Registration successful!");
      }

      const { token, user, role } = response.data;

      localStorage.setItem("auth_token", token);
      localStorage.setItem("user_data", JSON.stringify(user));

      setUser(user);

      // ✅ connect socket safely
      connectSocket();
      const s = getSocket();
      s?.emit("join", `user_${user.user_id}`);

      navigate(`/${role}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Authentication failed");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${campusBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background/30 to-secondary/10 backdrop-blur-sm" />
      </div>

      <GlassCard className="w-full max-w-md z-10 animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary mb-4 glow-primary">
            <span className="text-white font-bold text-2xl">PM</span>
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">
            Welcome to PMES
          </h1>
          <p className="text-muted-foreground">
            Project Management & Evaluation System
          </p>
        </div>

        <Tabs value={isLogin ? "login" : "register"} onValueChange={(v) => setIsLogin(v === "login")}>
          <TabsList className="grid grid-cols-2 w-full mb-6 bg-white/95">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <div className="mb-6">
            <Label className="block text-center mb-3">Select Your Role</Label>
            <div className="grid grid-cols-3 gap-3">
              {(["student", "guide", "admin"] as UserRole[]).map((role) => {
                const Icon = roleIcons[role];
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`bg-white/95 p-4 rounded-xl flex flex-col items-center ${
                      selectedRole === role ? "ring-2 ring-primary shadow-lg" : ""
                    }`}
                  >
                    <Icon className="h-6 w-6 text-foreground" />
                    <span className="text-xs capitalize">{role}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <TabsContent value="register">
              <div>
                <Label>Full Name</Label>
                <Input
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </TabsContent>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="•••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>
        </Tabs>
      </GlassCard>
    </div>
  );
}
