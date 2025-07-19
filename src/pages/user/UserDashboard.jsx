import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserDashboard() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/properties")
      .then(res => setProperties(res.data))
      .catch(err => console.error("Failed to fetch properties", err));
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "'Poppins', sans-serif", backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <h2 style={{ color: "#0F4C5C", marginBottom: "20px" }}>Available Properties</h2>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "24px"
      }}>
        {properties.map((property, index) => (
          <div key={index} style={{
            backgroundColor: "#fff",
            padding: "16px",
            borderRadius: "12px",
            boxShadow: "0 6px 14px rgba(0,0,0,0.08)"
          }}>
            <img
              src={property.image || "https://source.unsplash.com/featured/?real-estate"}
              alt={property.title}
              style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "8px" }}
            />
            <h3 style={{ color: "#0F4C5C", fontSize: "18px", marginTop: "10px" }}>{property.title}</h3>
            <p style={{ margin: "6px 0", fontWeight: "500" }}>{property.location}</p>
            <p style={{ margin: "4px 0" }}>💰 ₹{property.price?.toLocaleString()}</p>
            <p style={{ margin: "4px 0" }}>📐 {property.area} sq.ft</p>
            <p style={{ margin: "4px 0" }}>🛏️ {property.bedrooms} Bed | 🛁 {property.bathrooms} Bath</p>
            <button style={{
              marginTop: "10px",
              padding: "8px 14px",
              backgroundColor: "#E0B973",
              color: "#0F4C5C",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600"
            }}>
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
