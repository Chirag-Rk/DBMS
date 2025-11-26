import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FolderKanban, Users, CheckCircle, Clock } from 'lucide-react';

export default function GuideDashboard() {
  const teams = [
    { name: 'Team Alpha', members: 5, progress: 75, project: 'E-Commerce Platform' },
    { name: 'Team Beta', members: 4, progress: 60, project: 'Mobile Banking App' },
    { name: 'Team Gamma', members: 6, progress: 45, project: 'Healthcare System' },
  ];

  const pendingEvaluations = [
    { team: 'Team Alpha', milestone: 'Phase 2 Completion', submitted: '2 hours ago' },
    { team: 'Team Delta', milestone: 'Initial Design', submitted: '1 day ago' },
    { team: 'Team Epsilon', milestone: 'Testing Report', submitted: '2 days ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Teams Overview */}
      <div>
        <h2 className="text-2xl font-bold mb-4">My Teams</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teams.map((team, index) => (
            <Card key={index} className="glass-card-hover border-white/30 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderKanban className="h-5 w-5 text-primary" />
                  {team.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1">{team.project}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {team.members} members
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span className="font-medium">{team.progress}%</span>
                  </div>
                  <Progress value={team.progress} className="h-2" />
                </div>
                <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90" size="sm">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Pending Evaluations */}
      <Card className="glass-card border-white/30 animate-fade-in" style={{ animationDelay: '300ms' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-accent" />
            Pending Evaluations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pendingEvaluations.map((evaluation, index) => (
              <div key={index} className="glass-card p-4 flex items-center justify-between hover:bg-white/20 transition-all">
                <div>
                  <p className="font-medium">{evaluation.team}</p>
                  <p className="text-sm text-muted-foreground">{evaluation.milestone}</p>
                  <p className="text-xs text-muted-foreground mt-1">Submitted {evaluation.submitted}</p>
                </div>
                <Button className="bg-gradient-to-r from-violet-500 to-purple-500 hover:opacity-90 glow-secondary">
                  Evaluate
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card border-white/30 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 glow-primary">
                <FolderKanban className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Teams</p>
                <h3 className="text-2xl font-bold">{teams.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/30 animate-fade-in" style={{ animationDelay: '500ms' }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 glow-secondary">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <h3 className="text-2xl font-bold">{pendingEvaluations.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/30 animate-fade-in" style={{ animationDelay: '600ms' }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <h3 className="text-2xl font-bold">24</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

