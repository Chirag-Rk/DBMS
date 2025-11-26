import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, BarChart3 } from 'lucide-react';

export default function Reports() {
  const reports = [
    { id: 1, title: 'Team Performance Report', date: 'Mar 15, 2024', type: 'PDF' },
    { id: 2, title: 'Student Progress Analysis', date: 'Mar 10, 2024', type: 'Excel' },
    { id: 3, title: 'Milestone Completion Stats', date: 'Mar 5, 2024', type: 'PDF' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Reports
        </h1>
        <Button className="gap-2 glow-primary">
          <BarChart3 className="h-4 w-4" />
          Generate Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card p-6">
          <h3 className="text-4xl font-bold text-primary mb-2">24</h3>
          <p className="text-muted-foreground">Total Students</p>
        </Card>
        <Card className="glass-card p-6">
          <h3 className="text-4xl font-bold text-secondary mb-2">6</h3>
          <p className="text-muted-foreground">Active Teams</p>
        </Card>
        <Card className="glass-card p-6">
          <h3 className="text-4xl font-bold text-accent mb-2">85%</h3>
          <p className="text-muted-foreground">Avg Completion Rate</p>
        </Card>
      </div>

      <Card className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Reports</h2>
        <div className="space-y-3">
          {reports.map((report) => (
            <div key={report.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/10 transition-colors">
              <div>
                <h3 className="font-medium">{report.title}</h3>
                <p className="text-sm text-muted-foreground">{report.date} • {report.type}</p>
              </div>
              <Button variant="ghost" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
