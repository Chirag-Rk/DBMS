import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import api from "@/lib/api";
import EvaluateModal from "./EvaluateModal";

interface Submission {
  submission_id: number;
  team_name: string;
  milestone_name: string;
  upload_time: string;
  status: string;
}

export default function Submissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<number | null>(null);

  // 🔥 Fetch submissions assigned to this guide
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/submissions/guide");
        console.log("Guide Submissions:", res.data);
        setSubmissions(res.data.submissions);
      } catch (err) {
        console.error("Failed to load submissions:", err);
        setError("Failed to load submissions");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="text-muted-foreground">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Submissions</h1>

      <Card className="glass-card p-6">
        <div className="space-y-4">
          {submissions.length === 0 && (
            <p className="text-center text-muted-foreground">No submissions found</p>
          )}

          {submissions.map((submission) => (
            <div
              key={submission.submission_id}
              className="flex items-center justify-between p-4 rounded-xl hover:bg-white/10 transition-colors"
            >
              {/* LEFT SIDE */}
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/20">
                  <FileText className="h-5 w-5 text-primary" />
                </div>

                <div>
                  <h3 className="font-medium">
                    {submission.team_name} – {submission.milestone_name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Submitted on {new Date(submission.upload_time).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    submission.status === "Evaluated"
                      ? "bg-primary/20 text-primary"
                      : "bg-secondary/20 text-secondary"
                  }`}
                >
                  {submission.status}
                </span>

                {submission.status === "Pending Review" ? (
                  <Button
                    size="sm"
                    onClick={() => setSelectedSubmissionId(submission.submission_id)}
                  >
                    Evaluate
                  </Button>
                ) : (
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 🔥 Modal */}
      {selectedSubmissionId && (
        <EvaluateModal
          submissionId={selectedSubmissionId}
          onClose={() => setSelectedSubmissionId(null)}
          onSuccess={() => window.location.reload()}
        />
      )}
    </div>
  );
}
