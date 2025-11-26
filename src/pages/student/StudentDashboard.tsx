import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Target, Upload, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function StudentDashboard() {
  const projectInfo = {
    name: 'E-Commerce Platform',
    guide: 'Dr. Sarah Johnson',
    team: 'Team Alpha',
    progress: 75,
    startDate: 'Jan 15, 2024',
    endDate: 'May 30, 2024',
  };

  const milestones = [
    { name: 'Project Proposal', dueDate: 'Feb 1, 2024', status: 'completed', score: 95 },
    { name: 'Design Phase', dueDate: 'Mar 1, 2024', status: 'completed', score: 88 },
    { name: 'Development Phase 1', dueDate: 'Apr 1, 2024', status: 'in-progress', score: null },
    { name: 'Testing & QA', dueDate: 'May 1, 2024', status: 'pending', score: null },
    { name: 'Final Presentation', dueDate: 'May 30, 2024', status: 'pending', score: null },
  ];

  const recentFeedback = [
    {
      milestone: 'Design Phase',
      guide: 'Dr. Sarah Johnson',
      score: 88,
      feedback: 'Excellent UI/UX design. Consider adding more interactive elements.',
      date: 'Mar 5, 2024',
    },
    {
      milestone: 'Project Proposal',
      guide: 'Dr. Sarah Johnson',
      score: 95,
      feedback: 'Well-structured proposal with clear objectives. Great work!',
      date: 'Feb 8, 2024',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      completed: { variant: 'default', label: 'Completed' },
      'in-progress': { variant: 'secondary', label: 'In Progress' },
      pending: { variant: 'outline', label: 'Pending' },
    };
    const config = variants[status] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Project Overview */}
      <Card className="glass-card border-white/30 animate-fade-in">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">{projectInfo.name}</CardTitle>
              <p className="text-sm text-muted-foreground">Guide: {projectInfo.guide}</p>
              <p className="text-sm text-muted-foreground">Team: {projectInfo.team}</p>
            </div>
            <Badge className="bg-gradient-to-r from-primary to-secondary">Active</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Overall Progress</span>
              <span className="font-medium">{projectInfo.progress}%</span>
            </div>
            <Progress value={projectInfo.progress} className="h-3 glow-primary" />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {projectInfo.startDate} - {projectInfo.endDate}
            </span>
            <span className="font-medium">68 days remaining</span>
          </div>
        </CardContent>
      </Card>

      {/* Milestones Timeline */}
      <Card className="glass-card border-white/30 animate-fade-in" style={{ animationDelay: '100ms' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Project Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div key={index} className="glass-card p-4 hover:bg-white/20 transition-all neon-border">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(milestone.status)}
                    <div>
                      <h4 className="font-medium">{milestone.name}</h4>
                      <p className="text-sm text-muted-foreground">Due: {milestone.dueDate}</p>
                    </div>
                  </div>
                  {getStatusBadge(milestone.status)}
                </div>
                {milestone.score && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm font-medium">Score:</span>
                    <span className="text-lg font-bold text-primary">{milestone.score}/100</span>
                  </div>
                )}
                {milestone.status === 'in-progress' && (
                  <Button className="w-full mt-3 bg-gradient-to-r from-primary to-secondary hover:opacity-90 glow-primary" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Submission
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Feedback */}
      <Card className="glass-card border-white/30 animate-fade-in" style={{ animationDelay: '200ms' }}>
        <CardHeader>
          <CardTitle>Recent Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentFeedback.map((feedback, index) => (
              <div key={index} className="glass-card p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{feedback.milestone}</h4>
                    <p className="text-sm text-muted-foreground">by {feedback.guide}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{feedback.score}</div>
                    <p className="text-xs text-muted-foreground">out of 100</p>
                  </div>
                </div>
                <p className="text-sm glass-card p-3 rounded-lg">{feedback.feedback}</p>
                <p className="text-xs text-muted-foreground">{feedback.date}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
