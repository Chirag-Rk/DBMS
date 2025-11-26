import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import api from "@/lib/api";   // ✅ USE AXIOS WITH TOKEN

interface Evaluation {
  team: string;
  milestone: string;
  score: number;
  date: string;
}

export default function Evaluations() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ This automatically includes Authorization: Bearer token
        const res = await api.get("/evaluations");

        setEvaluations(res.data || []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load evaluations");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const avgScore =
    evaluations.length > 0
      ? Math.round(
          evaluations.reduce((sum, v) => sum + v.score, 0) / evaluations.length
        )
      : 0;

  const totalTeams = new Set(evaluations.map((e) => e.team)).size;

  if (loading) return <p className="text-gray-400">Loading…</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Evaluations</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-4xl font-bold">{avgScore}</h3>
          <p>Average Score</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-4xl font-bold">{evaluations.length}</h3>
          <p>Total Evaluations</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-4xl font-bold">{totalTeams}</h3>
          <p>Teams Evaluated</p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl mb-4">Recent Evaluations</h2>

        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="py-3 px-4">Team</th>
              <th className="py-3 px-4">Milestone</th>
              <th className="py-3 px-4">Score</th>
              <th className="py-3 px-4">Date</th>
            </tr>
          </thead>

          <tbody>
            {evaluations.map((evaluation, idx) => (
              <tr key={idx} className="border-b">
                <td className="py-3 px-4">{evaluation.team}</td>
                <td className="py-3 px-4">{evaluation.milestone}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    <span>{evaluation.score}/100</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-400">{evaluation.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
