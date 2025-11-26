import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function AdminGuides() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadGuides = async () => {
    try {
      const res = await api.get("/users?role=guide")
      setGuides(res.data || []);
    } catch (err) {
      console.error("Failed to fetch guides", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadGuides();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Guides</h1>

      {loading ? (
        <p>Loading...</p>
      ) : guides.length === 0 ? (
        <p>No guides found.</p>
      ) : (
        <ul className="space-y-3">
          {guides.map((g: any) => (
            <li key={g.user_id} className="p-3 bg-white rounded shadow">
              <div className="font-semibold">{g.full_name}</div>
              <div className="text-gray-600">{g.email}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
