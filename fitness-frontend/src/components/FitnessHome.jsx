import React from "react";
import { Dumbbell, HeartPulse, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const features = [
  {
    icon: <Dumbbell className="w-10 h-10" />,
    title: "Strength Training",
    desc: "Build muscle and track workouts effectively",
  },
  {
    icon: <HeartPulse className="w-10 h-10" />,
    title: "Heart Monitoring",
    desc: "Track heart rate and improve endurance",
  },
  {
    icon: <Activity className="w-10 h-10" />,
    title: "Daily Activity",
    desc: "Steps, calories & active minutes in one place",
  },
];

const images = [
  "https://images.unsplash.com/photo-1554284126-aa88f22d8b74",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
  "https://images.unsplash.com/photo-1599058917212-d750089bc07e",
];

export default function FitnessHome() {
 
  return (
    <div className="mb-5">
        {/* Bootstrap Carousel */}
        <div className="container mt-4">
            <div id="fitnessCarousel" className="carousel slide" data-bs-ride="carousel">
            
            {/* Indicators */}
            <div className="carousel-indicators">
                {images.map((_, index) => (
                <button
                    key={index}
                    type="button"
                    data-bs-target="#fitnessCarousel"
                    data-bs-slide-to={index}
                    className={index === 0 ? "active" : ""}
                ></button>
                ))}
            </div>

            {/* Slides */}
            <div className="carousel-inner rounded-4 overflow-hidden">
                {images.map((img, index) => (
                <div
                    key={index}
                    className={`carousel-item ${index === 0 ? "active" : ""}`}
                >
                    <img
                    src={img}
                    className="d-block w-100"
                    style={{ height: "350px", objectFit: "cover" }}
                    />

                    {/* Overlay text */}
                    <div className="carousel-caption d-flex align-items-center justify-content-center h-100">
                    <h2 className="fw-bold">Push Your Limits</h2>
                    </div>
                </div>
                ))}
            </div>

            {/* Controls */}
            <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#fitnessCarousel"
                data-bs-slide="prev"
            >
                <span className="carousel-control-prev-icon"></span>
            </button>

            <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#fitnessCarousel"
                data-bs-slide="next"
            >
                <span className="carousel-control-next-icon"></span>
            </button>
            </div>
        </div>

        {/* Hero Section */}
        <div className="container text-center mt-5">
            <h1 className="fw-bold display-5">Upgrade Your Fitness Lifestyle</h1>
            <p className="text-muted mt-3">
                Track workouts, monitor health, and stay consistent with your fitness goals.
            </p>
            <Link to="/login"><button className="btn btn-primary mt-3 px-4">Login</button></Link>
        </div>
        {/* Features Section */}
        <div className="container mt-5">
            <div className="row text-center">
                {features.map((feature, index) => (
                <div key={index} className="col-md-4 mb-4">
                    <div className="p-4 shadow rounded-4 h-100">
                    <div className="mb-3 d-flex justify-content-center">
                        {feature.icon}
                    </div>
                    <h4>{feature.title}</h4>
                    <p className="text-muted">{feature.desc}</p>
                    </div>
                </div>
                ))}
            </div>
        </div>
        {/* CTA Section */}
        <div className="container mt-5 text-center bg-dark text-white p-5 rounded-4">
            <h2 className="fw-bold">Start Your Fitness Journey Today</h2>
            <p className="mt-3">
                Join thousands of users improving their health and lifestyle.
            </p>
            <Link to="/register"><button className="btn btn-success mt-3 px-4">Register</button></Link>
        </div>
    </div>
  );
}