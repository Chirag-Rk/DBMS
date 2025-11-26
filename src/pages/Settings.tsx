import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Settings
      </h1>

      <Card className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
        <div className="space-y-4 max-w-xl">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" defaultValue={user?.name} className="glass-card border-white/30" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={user?.email} className="glass-card border-white/30" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" defaultValue={user?.role} disabled className="glass-card border-white/30 opacity-60" />
          </div>
          <Button className="glow-primary">Save Changes</Button>
        </div>
      </Card>

      <Card className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-6">Change Password</h2>
        <div className="space-y-4 max-w-xl">
          <div className="space-y-2">
            <Label htmlFor="current">Current Password</Label>
            <Input id="current" type="password" className="glass-card border-white/30" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new">New Password</Label>
            <Input id="new" type="password" className="glass-card border-white/30" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm New Password</Label>
            <Input id="confirm" type="password" className="glass-card border-white/30" />
          </div>
          <Button className="glow-primary">Update Password</Button>
        </div>
      </Card>
    </div>
  );
}
