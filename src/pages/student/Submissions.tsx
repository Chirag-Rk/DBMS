import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText } from 'lucide-react';

export default function Submissions() {
  const submissions = [
    { id: 1, milestone: 'Design Phase', date: 'Mar 1, 2024', file: 'design_document.pdf', status: 'Evaluated' },
    { id: 2, milestone: 'Project Proposal', date: 'Feb 1, 2024', file: 'proposal.pdf', status: 'Evaluated' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Submissions
        </h1>
        <Button className="gap-2 glow-primary">
          <Upload className="h-4 w-4" />
          New Submission
        </Button>
      </div>

      <Card className="glass-card p-6">
        <div className="border-2 border-dashed border-white/30 rounded-xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">Upload Submission</h3>
          <p className="text-sm text-muted-foreground mb-4">Drag and drop files here or click to browse</p>
          <Button>Choose Files</Button>
        </div>
      </Card>

      <Card className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-4">Previous Submissions</h2>
        <div className="space-y-3">
          {submissions.map((submission) => (
            <div key={submission.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/20">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{submission.milestone}</h3>
                  <p className="text-sm text-muted-foreground">{submission.file} • {submission.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs bg-primary/20 text-primary">
                  {submission.status}
                </span>
                <Button variant="outline" size="sm">View</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
