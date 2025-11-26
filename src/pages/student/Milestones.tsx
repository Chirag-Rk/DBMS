import { Card } from '@/components/ui/card';
import { Target, CheckCircle2, Clock } from 'lucide-react';

export default function Milestones() {
  const milestones = [
    { id: 1, title: 'Project Proposal', dueDate: 'Feb 1, 2024', status: 'Completed', score: 95 },
    { id: 2, title: 'Design Phase', dueDate: 'Mar 1, 2024', status: 'Completed', score: 88 },
    { id: 3, title: 'Implementation', dueDate: 'Apr 15, 2024', status: 'In Progress', score: null },
    { id: 4, title: 'Testing & QA', dueDate: 'May 1, 2024', status: 'Upcoming', score: null },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Project Milestones
      </h1>

      <div className="space-y-4">
        {milestones.map((milestone, index) => (
          <Card key={milestone.id} className="glass-card-hover p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className={`p-3 rounded-xl ${
                  milestone.status === 'Completed' ? 'bg-primary/20' :
                  milestone.status === 'In Progress' ? 'bg-secondary/20' :
                  'bg-muted/20'
                }`}>
                  {milestone.status === 'Completed' ? (
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  ) : milestone.status === 'In Progress' ? (
                    <Clock className="h-6 w-6 text-secondary" />
                  ) : (
                    <Target className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{milestone.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      milestone.status === 'Completed' ? 'bg-primary/20 text-primary' :
                      milestone.status === 'In Progress' ? 'bg-secondary/20 text-secondary' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {milestone.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">Due: {milestone.dueDate}</p>
                  {milestone.score && (
                    <p className="text-sm mt-2">
                      <span className="font-medium">Score:</span>{' '}
                      <span className="text-primary font-bold text-lg">{milestone.score}/100</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
