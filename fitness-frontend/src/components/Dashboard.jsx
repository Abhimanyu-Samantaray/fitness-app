import React, { useMemo, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import { Link } from "react-router-dom";

const BASE_URL = "https://fitness-app-0ulb.onrender.com";

export default function UserDashboard() {

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      setError("No token found. Please login again.");
      setLoading(false);
      return;
    } 
    
    fetch(`${BASE_URL}/api/activities/`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        console.log("STATUS:", res.status); // 🔍 debug

        if (!res.ok) {
          throw new Error("Unauthorized or API error");
        }
        return res.json();
      })
      .then(data => {
        console.log("DATA:", data); // 🔍 debug
        setActivities(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
        localStorage.removeItem("jwt");
        navigate("/");
      });

  }, []);

  const chartData = useMemo(
    () =>
      activities.map((a) => ({
        name: a.type,
        calories: a.caloriesBurned,
      })),
    [activities]
  );

  const totalCalories = activities.reduce((s, a) => s + a.caloriesBurned, 0);
  const totalDuration = activities.reduce((s, a) => s + a.duration, 0);

  // ✅ Loading UI
  if (loading) {
    return <h3 className="text-center mt-5">Loading...</h3>;
  }

  // ✅ Error UI
  if (error) {
    return <h3 className="text-center mt-5 text-danger">{error}</h3>;
  }

  return (
    <div className="container-fluid bg-light min-vh-100 py-4">

      <div className="container mb-4">
        <h2 className="fw-bold text-center">🏋️ Fitness Dashboard</h2>
        <p className="text-muted">Track your activity & AI recommendations</p>
      </div>

      <div className="container">
        <div className="row g-4">

          <div className="col-md-4">
            <Link to="/dashboard/add-activity" className="text-decoration-none">
              <div className="card text-white bg-primary shadow-lg rounded-4">
                <div className="card-body">
                  <h6>Total Activities</h6>
                  <h2>{activities.length}</h2>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-md-4">
            <div className="card text-white bg-success shadow-lg rounded-4">
              <div className="card-body">
                <h6>Total Calories</h6>
                <h2>{totalCalories}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card text-white bg-dark shadow-lg rounded-4">
              <div className="card-body">
                <h6>Total Duration</h6>
                <h2>{totalDuration} min</h2>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="container mt-4">
        <div className="card shadow-sm rounded-4 p-3">
          <h5 className="mb-3">Calories Burned Overview</h5>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="calories" fill="#0d6efd" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="container mt-4">
        <h5 className="mb-3">Recent Activities</h5>

        <div className="row g-3">

          {activities.length === 0 && (
            <p className="text-muted">No activities found</p>
          )}

          {activities.map((a) => (
            <div key={a.id} className="col-md-4">
              <div className="card shadow-sm border-0 rounded-4 h-100">
                <div className="card-body">

                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold">{a.type}</h5>
                    <span className="badge bg-primary">
                      {a.duration} min
                    </span>
                  </div>

                  <p className="text-muted mb-1">
                    Calories: {a.caloriesBurned}
                  </p>

                  <small className="text-secondary">
                    {new Date(a.startTime).toLocaleString()}
                  </small>

                  <div className="mt-3 p-2 bg-light border rounded-3">
                    <small className="text-primary fw-bold">AI Coach</small>
                    <p className="mb-0 small">{a.recommendation}</p>
                  </div>

                </div>
              </div>
            </div>
          ))}

        </div>
      </div>

    </div>
  );
}