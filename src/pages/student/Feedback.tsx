import { Card } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

export default function Feedback() {
  const feedbacks = [
    {
      id: 1,
      milestone: 'Design Phase',
      score: 88,
      date: 'Mar 2, 2024',
      guide: 'Dr. Sarah Wilson',
      comments: 'Excellent work on the UI/UX design. The user flow is well thought out. Consider adding more accessibility features in the next iteration.'
    },
    {
      id: 2,
      milestone: 'Project Proposal',
      score: 95,
      date: 'Feb 5, 2024',
      guide: 'Dr. Sarah Wilson',
      comments: 'Outstanding proposal! The problem statement is clear and the proposed solution is innovative. Looking forward to seeing the implementation.'
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Feedback
      </h1>

      <div className="space-y-4">
        {feedbacks.map((feedback) => (
          <Card key={feedback.id} className="glass-card-hover p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 rounded-xl bg-primary/20 glow-primary">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{feedback.milestone}</h3>
                  <span className="text-2xl font-bold text-primary">{feedback.score}/100</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {feedback.guide} • {feedback.date}
                </p>
                <div className="p-4 rounded-xl bg-white/10">
                  <p className="text-sm leading-relaxed">{feedback.comments}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
