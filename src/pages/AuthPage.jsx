import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function AuthPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get("role") || localStorage.getItem("selectedRole") || "user";

  const [activeTab, setActiveTab] = useState("login");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    localStorage.setItem("selectedRole", role);
    window.scrollTo(0, 0);
  }, [role]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        ...loginData,
        role
      });

      const user = res.data.user;

      if (user.role !== role) {
        alert(`You're registered as a ${user.role}. Please log in through the ${user.role} portal.`);
        return;
      }

      localStorage.setItem("currentUser", JSON.stringify(user));
      localStorage.setItem("userId", user._id);

      if (user.role === "broker") {
        window.location.href = "/broker-dashboard";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      alert("Login failed: " + (err.response?.data?.error || "Check your credentials"));
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        ...signupData,
        role
      });

      const user = res.data.user;
      localStorage.setItem("currentUser", JSON.stringify(user));
      localStorage.setItem("userId", user._id);

      if (user.role === "broker") {
        window.location.href = "/broker-dashboard";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      alert("Signup failed: " + (err.response?.data?.error || "Please try again"));
    }
  };

  return (
    <div style={styles.wrapper}>
      <a href="/" style={styles.backLink}>← Back to Home</a>
      <h2 style={styles.heading}>{capitalize(role)} Portal</h2>

      <div style={styles.container}>
        <div style={{ ...styles.formSection, backgroundColor: activeTab === "login" ? "#FDF2D8" : "#F9F6F1" }}>
          <h3 style={styles.subheading}>Login</h3>
          <form onSubmit={handleLoginSubmit} style={styles.form}>
            <input
              type="email"
              placeholder="Email"
              required
              style={styles.input}
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              required
              style={styles.input}
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            />
            <button type="submit" style={styles.button}>Login</button>
          </form>
        </div>

        <div style={styles.toggleBar} onClick={() => setActiveTab(activeTab === "login" ? "signup" : "login")}>
          Switch to {activeTab === "login" ? "Sign Up" : "Login"}
        </div>

        <div style={{ ...styles.formSection, backgroundColor: activeTab === "signup" ? "#FDF2D8" : "#F9F6F1" }}>
          <h3 style={styles.subheading}>Sign Up</h3>
          <form onSubmit={handleSignupSubmit} style={styles.form}>
            <input
              type="text"
              placeholder="Full Name"
              required
              style={styles.input}
              value={signupData.name}
              onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              required
              style={styles.input}
              value={signupData.email}
              onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              required
              style={styles.input}
              value={signupData.password}
              onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
            />
            <button type="submit" style={styles.button}>Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    backgroundColor: "#FFF7EB",
    fontFamily: "'Poppins', sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px 16px",
  },
  heading: {
    fontSize: "28px",
    fontFamily: "'Playfair Display', serif",
    color: "#0F4C5C",
    marginBottom: "28px",
    textAlign: "center"
  },
  backLink: {
    alignSelf: "flex-start",
    fontSize: "14px",
    marginBottom: "20px",
    marginLeft: "10%",
    color: "#0F4C5C",
    textDecoration: "underline",
    fontWeight: "500"
  },
  container: {
    width: "100%",
    maxWidth: "950px",
    backgroundColor: "#FFFFFF",
    borderRadius: "16px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.07)",
    display: "flex",
    overflow: "hidden",
    flexDirection: "row",
    transition: "all 0.3s ease-in-out"
  },
  formSection: {
    flex: 1,
    padding: "40px",
    transition: "all 0.3s ease"
  },
  toggleBar: {
    width: "60px",
    backgroundColor: "#E0B973",
    color: "#0F4C5C",
    fontWeight: "600",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    writingMode: "vertical-rl",
    transform: "rotate(180deg)",
    cursor: "pointer",
    fontSize: "14px",
    padding: "8px"
  },
  subheading: {
    fontSize: "20px",
    marginBottom: "20px",
    color: "#0F4C5C",
    fontFamily: "'Playfair Display', serif"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  input: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "15px"
  },
  button: {
    padding: "12px",
    backgroundColor: "#E0B973",
    border: "none",
    borderRadius: "8px",
    color: "#0F4C5C",
    fontWeight: "600",
    fontSize: "15px",
    cursor: "pointer",
    marginTop: "6px"
  }
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
