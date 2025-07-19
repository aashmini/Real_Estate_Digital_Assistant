import { NavLink } from "react-router-dom";

const menuItems = [
  { label: "Dashboard", path: "dashboard" },
  { label: "Properties", path: "properties" },
  { label: "Activity", path: "activity" },
  { label: "Settings", path: "settings" },
];

export default function UserSidebar() {
  return (
    <div style={{
      width: "230px",
      backgroundColor: "#F2C94C",
      padding: "30px 20px",
      fontFamily: "'Poppins', sans-serif",
      color: "#fff",
      minHeight: "100vh"
    }}>
      <h2 style={{ fontSize: "22px", marginBottom: "30px", fontFamily: "'Playfair Display', serif" }}>
        Real Agent
      </h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {menuItems.map((item) => (
          <li key={item.path} style={{ marginBottom: "16px" }}>
            <NavLink
              to={item.path}
              style={({ isActive }) => ({
                display: "block",
                padding: "10px 14px",
                borderRadius: "6px",
                backgroundColor: isActive ? "#fffbe6" : "#fff4d0",
                color: "#333",
                fontWeight: 500,
                textDecoration: "none",
                transition: "0.2s"
              })}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
