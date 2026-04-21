import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const activities = [
  {
    id: "1",
    type: "RUNNING",
    duration: 30,
    caloriesBurned: 250,
    startTime: "2026-04-21T07:00:00",
    recommendation: "Increase pace slightly for better fat burn.",
  },
  {
    id: "2",
    type: "CYCLING",
    duration: 45,
    caloriesBurned: 400,
    startTime: "2026-04-20T18:00:00",
    recommendation: "Maintain steady resistance for endurance.",
  },
  {
    id: "3",
    type: "YOGA",
    duration: 60,
    caloriesBurned: 180,
    startTime: "2026-04-19T06:30:00",
    recommendation: "Focus on breathing control and flexibility.",
  },
];

export default function UserDashboard() {
  const chartData = useMemo(
    () =>
      activities.map((a) => ({
        name: a.type,
        calories: a.caloriesBurned,
      })),
    []
  );

  const totalCalories = activities.reduce(
    (s, a) => s + a.caloriesBurned,
    0
  );

  const totalDuration = activities.reduce((s, a) => s + a.duration, 0);

  return (
    <div className="container-fluid bg-light min-vh-100 py-4">

      {/* Header */}
      <div className="container mb-4">
        <h2 className="fw-bold text-center">🏋️ Fitness Dashboard</h2>
        <p className="text-muted">Track your activity & AI recommendations</p>
      </div>

      {/* Summary Cards */}
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

      {/* Chart Section */}
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

      {/* Activity List */}
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

                  {/* AI Section */}
                  <div className="mt-3 p-2 bg-light border rounded-3">
                    <small className="text-primary fw-bold">
                      AI Coach
                    </small>
                    <p className="mb-0 small">
                      {a.recommendation}
                    </p>
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