import { useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function EvaluateModal({
  submissionId,
  onClose,
  onSuccess,
}: {
  submissionId: number;
  onClose: () => void;
  onSuccess: () => void;
}) {

  const { user } = useAuth();       // 🔥 GET LOGGED-IN GUIDE
  const guideId = user?.user_id;    // 🔥 GUIDE ID

  const [score, setScore] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!score) {
      alert("Score is required");
      return;
    }

    if (!guideId) {
      alert("Guide ID missing – login again");
      return;
    }

    setLoading(true);
    try {
      await api.post("/evaluations/add", {
        submission_id: submissionId,
        guide_id: guideId,   // 🔥🔥 FIXED – REQUIRED
        score: Number(score),
        feedback,
      });

      alert("Evaluation submitted!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Submit Evaluation Error:", err);
      alert("Failed to submit evaluation");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-[400px]">
        <h2 className="text-xl font-semibold mb-4">Evaluate Submission</h2>

        <label className="block text-sm font-medium mb-1">Score (0–100)</label>
        <input
          type="number"
          min={0}
          max={100}
          value={score}
          onChange={(e) => setScore(e.target.value)}
          className="w-full border rounded-md px-3 py-2 mb-4"
        />

        <label className="block text-sm font-medium mb-1">Feedback</label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full border rounded-md px-3 py-2 mb-4"
        ></textarea>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>
    </div>
  );
}
