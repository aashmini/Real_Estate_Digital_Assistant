import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BookmarksPage() {
  const navigate = useNavigate();
  const [bookmarked, setBookmarked] = useState([]);
  const [recommendationsByLocation, setRecommendationsByLocation] = useState([]);
  const [recommendationsByPrice, setRecommendationsByPrice] = useState([]);

  const formatPrice = (price) =>
    price && !isNaN(price) ? parseInt(price).toLocaleString("en-IN") : "N/A";

  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarkedProperties")) || [];
    setBookmarked(bookmarks);
    fetchRecommendations(bookmarks);
  }, []);

  const fetchRecommendations = (bookmarks) => {
    fetch("http://localhost:5000/api/properties")
      .then((res) => res.json())
      .then((allProps) => {
        const bookmarkedIds = new Set(bookmarks.map((p) => p._id));
        const byLocation = [];
        const byPrice = [];

        bookmarks.forEach((b) => {
          const loc = b.location?.trim().toLowerCase();
          const price = parseInt(b.price);

          allProps.forEach((p) => {
            if (bookmarkedIds.has(p._id)) return;

            const pLoc = p.location?.trim().toLowerCase();
            const pPrice = parseInt(p.price);

            if (pLoc && loc && (pLoc.includes(loc) || loc.includes(pLoc))) {
              byLocation.push(p);
            } else if (price && pPrice && Math.abs(pPrice - price) <= 1000000) {
              byPrice.push(p);
            }
          });
        });

        // Remove duplicates
        setRecommendationsByLocation([...new Map(byLocation.map((p) => [p._id, p])).values()]);
        setRecommendationsByPrice([...new Map(byPrice.map((p) => [p._id, p])).values()]);
      });
  };

  const handleUnbookmark = (id) => {
    const updated = bookmarked.filter((p) => p._id !== id);
    setBookmarked(updated);
    localStorage.setItem("bookmarkedProperties", JSON.stringify(updated));
  };

  const propertyCard = {
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    overflow: "hidden",
    position: "relative"
  };

  const propertyImage = {
    width: "100%",
    height: "180px",
    backgroundSize: "cover",
    backgroundPosition: "center"
  };

  const unbookmarkIcon = {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "transparent",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    color: "#e63946",
  };

  const renderPropertyCard = (prop, index, isBookmarked = false) => (
    <div key={index} style={propertyCard}>
      {isBookmarked && (
        <button
          onClick={() => handleUnbookmark(prop._id)}
          style={unbookmarkIcon}
          title="Unbookmark"
        >
          🔖
        </button>
      )}
      <div
        style={{
          ...propertyImage,
          backgroundImage: `url(${prop.image || `https://source.unsplash.com/400x300/?home,realestate&sig=${index}`})`,
        }}
      />
      <div style={{ padding: "16px" }}>
        <h4 style={{ fontSize: "18px", marginBottom: "8px", color: "#0F4C5C" }}>{prop.title}</h4>
        <p style={{ margin: "4px 0", fontWeight: "500", color: "#333" }}>₹ {formatPrice(prop.price)}</p>
        <p style={{ margin: "4px 0", color: "#666" }}>{prop.location}</p>
        <p style={{ fontSize: "13px", color: "#888", marginTop: "4px" }}>
          {prop.bedrooms} BHK • {prop.area} sq.ft • {prop.bathrooms} Bath
        </p>
      </div>
    </div>
  );

  return (
    <div style={{
      fontFamily: "'Poppins', sans-serif",
      backgroundColor: "#f9f9f9",
      minHeight: "100vh",
      paddingBottom: "40px"
    }}>
      <header style={{
        backgroundColor: "#0F4C5C",
        color: "#fff",
        padding: "16px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "26px" }}>My Bookmarks</h2>
        <button onClick={() => navigate("/dashboard")} style={{
          padding: "8px 14px",
          backgroundColor: "#E0B973",
          border: "none",
          borderRadius: "6px",
          color: "#0F4C5C",
          fontWeight: "600",
          fontSize: "14px",
          cursor: "pointer"
        }}>← Back to Dashboard</button>
      </header>

      <section style={{ padding: "40px" }}>
        <h3 style={{ fontSize: "22px", marginBottom: "20px", color: "#0F4C5C" }}>Bookmarked Properties</h3>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "24px"
        }}>
          {bookmarked.length === 0 ? (
            <p style={{ color: "#888" }}>No bookmarks yet.</p>
          ) : (
            bookmarked.map((prop, index) => renderPropertyCard(prop, index, true))
          )}
        </div>
      </section>

      <section style={{ padding: "0px 40px 40px" }}>
        <h3 style={{ fontSize: "22px", marginBottom: "20px", color: "#0F4C5C" }}>Smart Recommendations (Same Location)</h3>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "24px"
        }}>
          {recommendationsByLocation.length === 0 ? (
            <p style={{ color: "#888" }}>No location-based recommendations yet.</p>
          ) : (
            recommendationsByLocation.map((prop, index) => renderPropertyCard(prop, index))
          )}
        </div>
      </section>

      <section style={{ padding: "0px 40px 40px" }}>
        <h3 style={{ fontSize: "22px", marginBottom: "20px", color: "#0F4C5C" }}>Smart Recommendations (Similar Price)</h3>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "24px"
        }}>
          {recommendationsByPrice.length === 0 ? (
            <p style={{ color: "#888" }}>No price-based recommendations yet.</p>
          ) : (
            recommendationsByPrice.map((prop, index) => renderPropertyCard(prop, index))
          )}
        </div>
      </section>
    </div>
  );
}