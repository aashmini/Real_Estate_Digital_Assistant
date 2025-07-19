import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UserVisits() {
  const [visits, setVisits] = useState([]);
  const [recentVisitId, setRecentVisitId] = useState(
    localStorage.getItem("recentVisitPropertyId")
  );

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      axios
        .get(`http://localhost:5000/api/visits/user/${userId}`)
        .then((res) => {
          const sorted = res.data.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          setVisits(sorted);
        })
        .catch((err) => console.error("Error fetching user visits:", err));
    }

    // Remove recent visit highlight after 10 minutes
    if (recentVisitId) {
      setTimeout(() => {
        localStorage.removeItem("recentVisitPropertyId");
        setRecentVisitId(null);
      }, 600000); // 10 minutes = 600000 ms
    }
  }, []);

  return (
    <div
      style={{
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: "#FDF6EC",
        minHeight: "100vh",
      }}
    >
      <header
        style={{
          backgroundColor: "#0F4C5C",
          color: "#fff",
          padding: "20px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "3px solid #E0B973",
        }}
      >
        <h2
          style={{
            fontSize: "26px",
            fontFamily: "'Playfair Display', serif",
            margin: 0,
          }}
        >
          My Scheduled Visits
        </h2>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/auth?role=user";
          }}
          style={{
            backgroundColor: "#fff",
            color: "#0F4C5C",
            border: "1px solid #E0B973",
            padding: "8px 16px",
            borderRadius: "6px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </header>

      <section style={{ padding: "40px" }}>
        <h3
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "22px",
            marginBottom: "24px",
            color: "#0F4C5C",
          }}
        >
          Your Visit Requests
        </h3>

        <div
          style={{
            overflowX: "auto",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: "#fff",
            }}
          >
            <thead style={{ backgroundColor: "#0F4C5C", color: "#fff" }}>
              <tr>
                {["Property", "Location", "Date", "Time", "Status", ""].map(
                  (heading, i) => (
                    <th key={i} style={headerCell}>
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {visits.map((v, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={bodyCell}>{v.propertyId?.title || "Unnamed"}</td>
                  <td style={bodyCell}>
                    {v.propertyId?.location || "Unknown"}
                  </td>
                  <td style={bodyCell}>
                    {new Date(v.date).toLocaleDateString()}
                  </td>
                  <td style={bodyCell}>{v.time}</td>
                  <td style={bodyCell}>
                    <span
                      style={{
                        fontWeight: "600",
                        color:
                          v.status === "Accepted"
                            ? "#2E7D32"
                            : v.status === "Rejected"
                            ? "#C62828"
                            : "#FF8F00",
                      }}
                    >
                      {v.status}
                    </span>
                  </td>
                  <td style={bodyCell}>
                    {v.propertyId?._id === recentVisitId && (
                      <span
                        style={{
                          backgroundColor: "#E0F7FA",
                          color: "#006064",
                          padding: "4px 10px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        Scheduled Now
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {visits.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      ...bodyCell,
                      textAlign: "center",
                      padding: "30px",
                      color: "#999",
                    }}
                  >
                    No visit requests yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

const headerCell = {
  padding: "14px 20px",
  textAlign: "left",
  fontSize: "15px",
  fontWeight: "600",
  borderBottom: "2px solid #E0B973",
};

const bodyCell = {
  padding: "14px 20px",
  textAlign: "left",
  fontSize: "14px",
  color: "#333",
};
