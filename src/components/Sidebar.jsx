import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiHome, FiMapPin, FiUsers, FiCalendar, FiFileText, FiBarChart2, FiLogOut } from "react-icons/fi";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { label: "Dashboard", path: "/dashboard", icon: <FiHome /> },
    { label: "Meetings", path: "/meetings", icon: <FiCalendar /> },
    { label: "Decks", path: "/decks", icon: <FiFileText /> },
    { label: "Analytics", path: "/analytics", icon: <FiBarChart2 /> },
  ];

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.title}>CRE Assistant</h2>

      <ul style={styles.menuList}>
        {menu.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <li
              key={index}
              onClick={() => navigate(item.path)}
              style={{
                ...styles.menuItem,
                ...(isActive ? styles.activeItem : {}),
              }}
            >
              <span style={{ marginRight: "10px" }}>{item.icon}</span>
              {item.label}
            </li>
          );
        })}
      </ul>

      <div
        onClick={() => {
          localStorage.clear();
          navigate("/auth?role=broker");
        }}
        style={styles.logout}
      >
        <FiLogOut style={{ marginRight: "10px" }} />
        Logout
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "240px",
    minHeight: "100vh",
    backgroundColor: "#0F4C5C",
    color: "#fff",
    padding: "30px 20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "40px",
    color: "#E0B973",
    fontFamily: "'Playfair Display', serif"
  },
  menuList: {
    listStyle: "none",
    padding: 0,
    flex: 1,
  },
  menuItem: {
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "12px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    fontWeight: "500",
    backgroundColor: "transparent",
    transition: "all 0.2s ease",
  },
  activeItem: {
    backgroundColor: "#E0B973",
    color: "#0F4C5C",
    fontWeight: "600",
  },
  logout: {
    marginTop: "auto",
    cursor: "pointer",
    padding: "10px 16px",
    borderRadius: "8px",
    backgroundColor: "#E57373",
    display: "flex",
    alignItems: "center",
    fontWeight: "500",
    color: "#fff",
  },
};
