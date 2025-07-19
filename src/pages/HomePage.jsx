import React from 'react';
import { useNavigate } from 'react-router-dom';
import luxuryBg from '../assets/luxury-bg.jpg';

export default function HomePage() {
  const navigate = useNavigate();

  const handleRoleClick = (role) => {
    localStorage.setItem("selectedRole", role);
    navigate(`/auth?role=${role}`);
  };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", backgroundColor: "#FDF6EC", minHeight: "100vh" }}>
      {/* Header */}
      <header style={{
        backgroundColor: "#0F4C5C",
        padding: "10px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h1 style={{
          color: "#E0B973",
          fontSize: "22px",
          fontWeight: "700",
          margin: 0,
          fontFamily: "'Playfair Display', serif"
        }}>
          Real Agent
        </h1>
        <nav style={{
          display: "flex",
          gap: "20px",
          fontSize: "14px",
          color: "#FDF6EC",
          alignItems: "center"
        }}>
          <span onClick={() => navigate('/auth?role=user')} style={{ cursor: "pointer", fontWeight: "500" }}>Login</span>
          <span onClick={() => navigate('/auth?role=user')} style={{ cursor: "pointer", fontWeight: "500" }}>Sign Up</span>
        </nav>
      </header>

      {/* Hero Section */}
      <section
        style={{
          padding: "80px 30px",
          textAlign: "center",
          backgroundImage: `url(${luxuryBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#fff",
          position: "relative"
        }}
      >
        <div style={{
          position: "absolute", top: 0, bottom: 0, left: 0, right: 0,
          backgroundColor: "rgba(15, 76, 92, 0.6)", zIndex: 1
        }}></div>
        <div style={{ position: "relative", zIndex: 2, maxWidth: "800px", margin: "0 auto" }}>
          <h2 style={{
            fontSize: "42px",
            fontWeight: "bold",
            marginBottom: "16px",
            fontFamily: "'Playfair Display', serif"
          }}>
            Your Dream Home Awaits
          </h2>
          <p style={{ fontSize: "17px", marginBottom: "28px" }}>
            Find premium properties, expert advice, and unmatched support with Real Agent.
          </p>
          <button
            onClick={() => navigate("/listings")}
            style={{
              padding: "10px 28px",
              backgroundColor: "#E0B973",
              border: "none",
              borderRadius: "6px",
              color: "#333",
              fontWeight: "600",
              fontSize: "16px",
              cursor: "pointer"
            }}
          >
            Browse Listings
          </button>

          {/* Role Selection Section */}
          <div style={{
            marginTop: "40px",
            display: "flex",
            justifyContent: "center",
            gap: "24px",
            flexWrap: "wrap"
          }}>
            {["User", "Broker"].map(role => (
              <div
                key={role}
                onClick={() => handleRoleClick(role.toLowerCase())}
                style={{
                  backdropFilter: "blur(10px)",
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "10px",
                  padding: "14px 24px",
                  color: "#fff",
                  border: "1.5px solid rgba(255,255,255,0.3)",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  minWidth: "120px",
                  textAlign: "center",
                  transition: "all 0.3s ease-in-out",
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1.0)"}
              >
                {role}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: "50px 40px", backgroundColor: "#fff", textAlign: "center" }}>
        <h3 style={{
          fontSize: "30px",
          marginBottom: "24px",
          color: "#0F4C5C",
          fontFamily: "'Playfair Display', serif"
        }}>What Makes Us Unique</h3>

        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "30px",
          flexWrap: "wrap"
        }}>
          <FeatureCard
            title="Handpicked Listings"
            description="Our curated properties reflect excellence, luxury, and precision to ensure your dream home becomes reality."
            bgColor="#F9E79F"
          />
          <FeatureCard
            title="Immersive Virtual Tours"
            description="Experience state-of-the-art virtual tours with breathtaking views, interactive details, and real-time walkthroughs."
            bgColor="#FCE5CD"
          />
          <FeatureCard
            title="Trusted Real Estate Partners"
            description="Our seasoned team provides transparent advice, market insights, and unwavering support to make your journey stress-free."
            bgColor="#F6D7B0"
          />
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: "#0F4C5C",
        color: "#fff",
        textAlign: "center",
        padding: "20px",
        fontSize: "14px"
      }}>
        © 2024 Real Agent. Where Luxury Meets Lifestyle.
      </footer>
    </div>
  );
}

function FeatureCard({ title, description, bgColor }) {
  return (
    <div style={{
      width: "280px",
      backgroundColor: bgColor,
      padding: "22px",
      borderRadius: "12px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
      fontFamily: "'Poppins', sans-serif"
    }}>
      <h4 style={{
        fontSize: "20px",
        marginBottom: "12px",
        color: "#0F4C5C",
        fontFamily: "'Playfair Display', serif"
      }}>{title}</h4>
      <p style={{
        fontSize: "14px",
        color: "#333",
        lineHeight: "1.6"
      }}>{description}</p>
    </div>
  );
}
