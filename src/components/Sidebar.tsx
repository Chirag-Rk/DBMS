import { NavLink } from './NavLink';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  UsersRound, 
  FolderKanban, 
  Target,
  Upload,
  FileText,
  BarChart3,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  open: boolean;
}

export default function Sidebar({ open }: SidebarProps) {
  const { user } = useAuth();

  const adminLinks = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/students', icon: Users, label: 'Students' },
    { to: '/admin/guides', icon: UsersRound, label: 'Guides' },
    { to: '/admin/teams', icon: FolderKanban, label: 'Teams' },
    { to: '/admin/milestones', icon: Target, label: 'Milestones' },
    { to: '/admin/reports', icon: BarChart3, label: 'Reports' },
  ];

  const guideLinks = [
    { to: '/guide', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/guide/teams', icon: FolderKanban, label: 'My Teams' },
    { to: '/guide/submissions', icon: FileText, label: 'Submissions' },
    { to: '/guide/evaluations', icon: BarChart3, label: 'Evaluations' },
  ];

  const studentLinks = [
    { to: '/student', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/student/milestones', icon: Target, label: 'Milestones' },
    { to: '/student/submissions', icon: Upload, label: 'Submissions' },
    { to: '/student/feedback', icon: FileText, label: 'Feedback' },
  ];

  const links = user?.role === 'admin' ? adminLinks : user?.role === 'guide' ? guideLinks : studentLinks;

  return (
    <aside className={cn(
      "glass-card m-4 transition-all duration-300 animate-slide-in sticky top-4 h-[calc(100vh-2rem)]",
      open ? "w-64" : "w-20"
    )}>
      <div className="p-6 flex flex-col gap-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/20 text-foreground"
            activeClassName="bg-white/30 glow-primary"
          >
            <link.icon className="h-5 w-5 shrink-0" />
            {open && <span className="font-medium">{link.label}</span>}
          </NavLink>
        ))}

        <div className="mt-auto pt-6 border-t border-white/20">
          <NavLink
            to="/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/20 text-foreground"
            activeClassName="bg-white/30"
          >
            <Settings className="h-5 w-5 shrink-0" />
            {open && <span className="font-medium">Settings</span>}
          </NavLink>
        </div>
      </div>
    </aside>
  );
}
