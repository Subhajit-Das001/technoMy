import React, { useEffect, useRef, useState } from "react";
import { FaSchool, FaUserGraduate, FaCity } from "react-icons/fa";

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
    { label: "Schools", value: "2500", suffix: "+", icon: <FaSchool size={50} color="#3498db" /> },
    { label: "Students", value: "250", suffix: "K+", icon: <FaUserGraduate size={50} color="#e67e22" /> },
    { label: "Cities", value: "450", suffix: "+", icon: <FaCity size={50} color="#2ecc71" /> },
  ];

  return (
    <div className="statsclass" ref={statsRef} style={{ textAlign: "center", padding: "40px"}}>
      <h1 style={{ marginBottom: "40px", marginTop: "-15px", color: "#fff", fontSize: "3rem" }}>Our Impact</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "100px",
          marginTop: "0px",
          flexWrap: "wrap"
        }}
      >
        {stats.map((stat, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "20px",
              width: "250px",
              height: "225px",
              textAlign: "center",
              boxShadow: "0 6px 10px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.3s, box-shadow 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 8px 15px rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 6px 10px rgba(0, 0, 0, 0.1)";
            }}
          >
            <div style={{ marginBottom: "10px", marginLeft: "10px" }}>{stat.icon}</div>
            <h3 style={{ margin: "0", color: "#555", fontSize: "1.5rem" }}>{stat.label}</h3>
            <p
              style={{
                fontSize: "2.7rem",
                margin: "10px 0 0",
                fontWeight: "bold",
                color: "#34495e",
              }}
            >
              <Counter value={stat.value} suffix={stat.suffix} startCounting={startCounting} />
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stats;
