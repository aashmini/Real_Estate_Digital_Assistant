// src/pages/EditProfile.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const navigate = useNavigate();
  const broker = JSON.parse(localStorage.getItem("currentUser"));
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    profilePic: ""
  });
  const [preview, setPreview] = useState("");
const [menuOpen, setMenuOpen] = useState(false);
const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (broker) {
      setFormData({
        name: broker.name || "",
        email: broker.email || "",
        phone: broker.phone || "",
        company: broker.company || "",
        profilePic: broker.profilePic || ""
      });
      setPreview(broker.profilePic || "");
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, profilePic: reader.result }));
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.patch(`http://localhost:5000/api/brokers/${broker._id}`, formData);
      localStorage.setItem("currentUser", JSON.stringify(res.data));
      alert("✅ Profile updated successfully");
      navigate("/broker-dashboard");
    } catch (error) {
      console.error("Profile update failed:", error);
      alert("❌ Failed to update profile");
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
  <h2 style={styles.title}>Broker Profile</h2>

  <div style={styles.headerRight}>
    <div style={{ position: "relative" }} className="dropdown-container">
      <button style={styles.navButton} onClick={() => setDropdownOpen(!dropdownOpen)}>
        ☰ Menu
      </button>

      {dropdownOpen && (
        <div style={styles.dropdownMenu}>
          <div style={styles.dropdownItem} onClick={() => navigate("/broker-dashboard")}>🏠 Broker Dashboard</div>
          <div style={styles.dropdownItem} onClick={() => navigate("/meetings")}>📅 Meetings</div>
          <div style={styles.dropdownItem} onClick={() => navigate("/decks")}>🗂 Decks</div>
          <div style={styles.dropdownItem} onClick={() => navigate("/analytics")}>📊 Analytics</div>
          <div style={styles.dropdownItem} onClick={() => navigate("/contacts")}>👥 Client Contacts</div>
          <div
            style={styles.dropdownItem}
            onClick={() => {
              localStorage.clear();
              navigate("/auth?role=broker");
            }}
          >
            🚪 Logout
          </div>
        </div>
      )}
    </div>
  </div>
</header>



      {/* Profile Form */}
      <div style={styles.formBox}>
        {["name", "email", "phone", "company"].map((field) => (
          <input
            key={field}
            name={field}
            placeholder={`Enter ${field}`}
            value={formData[field]}
            onChange={handleChange}
            style={styles.input}
          />
        ))}

        <div style={{ marginBottom: "20px" }}>
          <label style={styles.label}>Upload Profile Picture:</label>
          <input type="file" onChange={handleFileChange} />
          {preview && <img src={preview} alt="Preview" style={styles.previewImg} />}
        </div>

        <button style={styles.saveBtn} onClick={handleUpdate}>
          Save Changes
        </button>
      </div>
    </div>
  );
}

// --- Styles ---
const styles = {
  container: {
    fontFamily: "'Poppins', sans-serif",
    minHeight: "100vh",
    backgroundColor: "#fef9f4"
  },
  header: {
  backgroundColor: "#0F4C5C",
  color: "#fff",
  padding: "20px 40px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap"
},
title: {
  fontSize: "24px",
  fontFamily: "'Playfair Display', serif",
  margin: 0
},
headerRight: {
  display: "flex",
  alignItems: "center",
  gap: "12px"
},
navButton: {
  backgroundColor: "#ffffff",
  color: "#0F4C5C",
  border: "1px solid #0F4C5C",
  padding: "8px 12px",
  borderRadius: "8px",
  fontWeight: "600",
  fontSize: "14px",
  cursor: "pointer"
},
dropdownMenu: {
  position: "absolute",
  top: "calc(100% + 10px)",
  right: 0,
  backgroundColor: "#fff",
  border: "1px solid #ddd",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  zIndex: 1000,
  display: "flex",
  flexDirection: "column",
  minWidth: "200px",
  padding: "8px 0"
},
dropdownItem: {
  padding: "12px 16px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "500",
  color: "#0F4C5C",
  textAlign: "left",
  backgroundColor: "white",
  borderBottom: "1px solid #eee"
},
  header: {
    backgroundColor: "#0F4C5C",
    color: "#fff",
    padding: "20px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopLeftRadius: "12px",
    borderTopRightRadius: "12px"
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    fontFamily: "'Playfair Display', serif",
    margin: 0
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "16px"
  },
  menuButton: {
    backgroundColor: "white",
    color: "#0F4C5C",
    padding: "6px 12px",
    fontWeight: "600",
    borderRadius: "8px",
    border: "none",
    fontSize: "16px",
    cursor: "pointer"
  },
  profileImage: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid white"
  },
  profilePlaceholder: {
    width: "40px",
    height: "40px",
    backgroundColor: "#ccc",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px"
  },
  formBox: {
    padding: "40px",
    maxWidth: "600px",
    margin: "40px auto",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)"
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "16px",
    fontSize: "14px"
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    color: "#0F4C5C"
  },
  previewImg: {
    marginTop: "12px",
    width: "80px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "50%",
    border: "2px solid #E0B973"
  },
  saveBtn: {
    backgroundColor: "#E0B973",
    color: "#0F4C5C",
    padding: "12px 20px",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer"
  }
};
