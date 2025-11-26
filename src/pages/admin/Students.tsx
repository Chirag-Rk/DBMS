import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadStudents = async () => {
    try {
      const res = await api.get("/users?role=student");
      setStudents(res.data || []);
    } catch (err) {
      console.error("Failed to fetch students", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadStudents();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Students</h1>

      {loading ? (
        <p>Loading...</p>
      ) : students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <ul className="space-y-3">
          {students.map((s: any) => (
            <li key={s.user_id} className="p-3 bg-white rounded shadow">
              <div className="font-semibold">{s.full_name}</div>
              <div className="text-gray-600">{s.email}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
