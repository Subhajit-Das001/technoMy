import React, { useEffect, useRef, useState } from "react";
import { FaSchool, FaUserGraduate, FaCity } from "react-icons/fa";
import './Stats.css'

const Counter = ({ value, suffix = "", duration = 3000, startCounting }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!startCounting) return;

    const start = 0;
    const end = parseFloat(value.toString().replace(/,/g, ""));
    const increment = (end - start) / (duration / 16); // Approximately 60 FPS

    let current = start;
    const interval = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
        clearInterval(interval);
        ref.current.textContent = `${end.toLocaleString()}${suffix}`; // Final value with suffix
      } else {
        ref.current.textContent = `${Math.round(current).toLocaleString()}${suffix}`;
      }
    }, 16);

    return () => clearInterval(interval); // Cleanup
  }, [value, duration, suffix, startCounting]);

  return <span ref={ref}></span>;
};

const Stats = () => {
  const statsRef = useRef(null);
  const [startCounting, setStartCounting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartCounting(true);
        }
      },
      { threshold: 0.4 } // Trigger when 30% of the element is visible
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  const stats = [
    { label: "Schools", value: "3200", suffix: "+", icon: <FaSchool size={50} color="#3498db" /> },
    { label: "Students", value: "300", suffix: "K+", icon: <FaUserGraduate size={50} color="#e67e22" /> },
    { label: "Cities", value: "750", suffix: "+", icon: <FaCity size={50} color="#2ecc71" /> },
  ];

  return (
    <div className="statsclass" ref={statsRef}>
    <h1>Our Impact</h1>
    <div className="stats-grid">
      {stats.map((stat, index) => (
        <div className="stat-card" key={index}>
          <div className="stat-icon">{stat.icon}</div>
          <h3 className="stat-label">{stat.label}</h3>
          <p className="stat-value">
            <Counter value={stat.value} suffix={stat.suffix} startCounting={startCounting} />
          </p>
        </div>
      ))}
    </div>
  </div>
    );
};

export default Stats;
