import React, { useMemo, useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const BASE_URL = "https://fitness-app-activity-service.onrender.com";

export default function UserDashboard() {

  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("jwt");

    fetch(`${BASE_URL}/api/activities`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setActivities(data))
      .catch(err => console.error(err));
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

  return (
    <div className="container-fluid bg-light min-vh-100 py-4">

      <div className="container mb-4">
        <h2 className="fw-bold text-center">🏋️ Fitness Dashboard</h2>
        <p className="text-muted">Track your activity & AI recommendations</p>
      </div>

      <div className="container">
        <div className="row g-4">

          <div className="col-md-4">
            <div className="card text-white bg-primary shadow-lg rounded-4">
              <div className="card-body">
                <h6>Total Activities</h6>
                <h2>{activities.length}</h2>
              </div>
            </div>
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