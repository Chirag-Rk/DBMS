import { ReactNode } from 'react';
import { Bell, LogOut, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import Sidebar from './Sidebar';
import { useState } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex">
      <Sidebar open={sidebarOpen} />
      
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <nav className="glass-card m-4 p-4 flex items-center justify-between sticky top-4 z-10 animate-fade-in">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hover:bg-white/20"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              PMES Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-white/20"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full animate-glow" />
            </Button>

            <div className="flex items-center gap-3 glass-card px-4 py-2">
              <Avatar className="h-8 w-8 ring-2 ring-primary/50">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="hover:bg-white/20 hover:text-destructive"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-4 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
