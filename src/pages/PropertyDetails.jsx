// ✅ Final Merged PropertyDetails.jsx with All Features
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [role, setRole] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [editFormData, setEditFormData] = useState({
    title: "", price: "", location: "", bedrooms: "", bathrooms: "", area: "", image: ""
  });

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    setRole(currentUser?.role || null);

    axios.get(`http://localhost:5000/api/properties`)
      .then(res => {
        const found = res.data.find(p => p._id === id);
        setProperty(found);
        if (found?._id) fetchReviews(found._id);
      })
      .catch(err => console.error("Failed to fetch property", err));
  }, [id]);

  const fetchReviews = (propertyId) => {
    axios.get(`http://localhost:5000/api/reviews?propertyId=${propertyId}`)
      .then(res => {
        const enriched = res.data.map((r) => ({
          ...r,
          sentiment: r.sentiment || "neutral"
        }));
        setReviews(enriched);
      })
      .catch(err => console.error("Error fetching reviews:", err));
  };

  const deleteReview = async (reviewId) => {
    try {
      await axios.delete(`http://localhost:5000/api/reviews/${reviewId}`);
      fetchReviews(property._id);
    } catch (err) {
      console.error("Error deleting review:", err);
      alert("Failed to delete review");
    }
  };

  const handleSchedule = () => setShowModal(true);

  const submitVisit = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser?._id) return alert("User not logged in");

    axios.post("http://localhost:5000/api/visits", {
      userId: currentUser._id,
      propertyId: property._id,
      date: visitDate,
      time: visitTime
    }).then(() => {
      alert("Visit scheduled successfully");
      setShowModal(false);
      setVisitDate("");
      setVisitTime("");
    }).catch(() => {
      alert("Failed to schedule visit");
    });
  };

  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;

    axios.delete(`http://localhost:5000/api/properties/${property._id}`)
      .then(() => {
        alert("Property deleted successfully");
        navigate("/broker-dashboard");
      }).catch(() => {
        alert("Failed to delete property");
      });
  };

  const openEditModal = () => {
    setEditFormData({
      title: property.title || "",
      price: property.price || "",
      location: property.location || "",
      bedrooms: property.bedrooms || "",
      bathrooms: property.bathrooms || "",
      area: property.area || "",
      image: property.image || ""
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = () => {
    const cleanedData = {
      ...editFormData,
      price: Number(editFormData.price),
      bedrooms: Number(editFormData.bedrooms),
      bathrooms: Number(editFormData.bathrooms),
      area: Number(editFormData.area),
    };

    axios.put(`http://localhost:5000/api/properties/${property._id}`, cleanedData)
      .then((res) => {
        alert("Property updated successfully");
        setShowEditModal(false);
        setProperty(res.data);
      })
      .catch((err) => {
        console.error("Failed to update:", err.response?.data || err.message);
        alert("Failed to update property");
      });
  };

  if (!property) return <p style={{ padding: "40px", textAlign: "center" }}>Loading property details...</p>;

  const fallbackImage = "https://source.unsplash.com/1000x500/?real-estate,luxury-home";

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={{ ...imageSectionStyle, backgroundImage: `url(${property.image || fallbackImage})` }} />

        <div style={{ padding: "30px" }}>
          <h2 style={titleStyle}>{property.title}</h2>
          <p style={locationStyle}>{property.location}</p>
          <p style={priceStyle}>₹ {property?.price?.toLocaleString("en-IN") || "Not Available"}</p>
          <p style={descStyle}>{property.description || "No description available."}</p>

          <p style={infoTagStyle}>
            🏠 {property.bedrooms} BHK • 📐 {property.area} sq.ft • 🚿 {property.bathrooms} Bath
          </p>

          <div style={{ marginTop: "20px", padding: "16px", backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
            <h3 style={{ color: "#0F4C5C" }}>Client Reviews</h3>
            {reviews.length === 0 ? (
              <p style={{ color: "#555" }}>No reviews yet.</p>
            ) : (
              reviews.map((r, idx) => (
                <div key={idx} style={{ marginBottom: "12px", padding: "10px", background: "#fff", borderRadius: "6px" }}>
                  <strong>{r.userId?.name || r.userId?.email}</strong>: {r.review}
                  <div style={{ fontSize: "13px", color: r.sentiment === "positive" ? "green" : r.sentiment === "negative" ? "red" : "#666" }}>
                    Sentiment: {r.sentiment}
                  </div>
                  {role === "broker" && (
                    <button onClick={() => deleteReview(r._id)} style={{ ...btnSecondary, marginTop: "6px" }}>
                      Delete Review
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "30px" }}>
            <button style={btnSecondary} onClick={() => setShowMap(!showMap)}>
              📍 {showMap ? "Hide Map" : "View on Map"}
            </button>
            {role === "user" && (
              <>
                <button style={btnPrimary} onClick={handleSchedule}>Schedule Meeting</button>
                <button style={btnSecondary}>Bookmark Property</button>
              </>
            )}
          </div>
        </div>
      </div>

      {showMap && (
        <section style={{ marginTop: "30px", maxWidth: "950px", margin: "30px auto" }}>
          <h3 style={{ color: "#0F4C5C", marginBottom: "10px", fontFamily: "'Playfair Display', serif" }}>
            Location Map: {property.location}
          </h3>
          <div style={{ borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent(property.location)}&output=embed`}
              width="100%" height="400" style={{ border: 0 }} allowFullScreen loading="lazy" title="Google Map"
            />
          </div>
        </section>
      )}

      {role === "user" && (
        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <button style={btnPrimary}>📈 ROI Calculator</button>
        </div>
      )}

      {role === "broker" && (
        <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "30px" }}>
          <button style={btnPrimary} onClick={openEditModal}>✏️ Edit Property</button>
          <button style={btnSecondary} onClick={handleDelete}>🗑️ Delete Property</button>
        </div>
      )}

      {showEditModal && (
        <div style={modalBackdrop}>
          <div style={modalContent}>
            <h3 style={{ marginBottom: "20px", fontSize: "20px", color: "#0F4C5C" }}>Edit Property</h3>
            {Object.keys(editFormData).map((field) => (
              <div key={field} style={{ marginBottom: "12px" }}>
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                <input
                  type={["price", "bedrooms", "bathrooms", "area"].includes(field) ? "number" : "text"}
                  value={editFormData[field]}
                  onChange={(e) => setEditFormData({ ...editFormData, [field]: e.target.value })}
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                />
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button onClick={() => setShowEditModal(false)} style={btnSecondary}>Cancel</button>
              <button onClick={handleEditSubmit} style={btnPrimary}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Styling
const btnPrimary = {
  padding: "12px 20px",
  backgroundColor: "#E0B973",
  border: "none",
  borderRadius: "8px",
  fontWeight: "600",
  fontSize: "15px",
  cursor: "pointer",
  color: "#0F4C5C"
};

const btnSecondary = {
  padding: "12px 20px",
  backgroundColor: "#ffffff",
  border: "1px solid #ddd",
  borderRadius: "8px",
  fontWeight: "500",
  fontSize: "15px",
  cursor: "pointer",
  color: "#0F4C5C"
};

const pageStyle = {
  fontFamily: "'Poppins', sans-serif",
  backgroundColor: "#f4f4f4",
  minHeight: "100vh",
  padding: "40px 20px"
};

const cardStyle = {
  maxWidth: "950px",
  margin: "0 auto",
  backgroundColor: "#fff",
  borderRadius: "16px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
  overflow: "hidden"
};

const imageSectionStyle = {
  width: "100%",
  height: "340px",
  backgroundSize: "cover",
  backgroundPosition: "center"
};

const titleStyle = {
  fontFamily: "'Playfair Display', serif",
  fontSize: "28px",
  color: "#0F4C5C",
  marginBottom: "8px"
};

const locationStyle = {
  fontSize: "15px",
  color: "#6a6a6a",
  marginBottom: "5px"
};

const priceStyle = {
  fontSize: "20px",
  fontWeight: "700",
  color: "#1d1d1d",
  marginBottom: "14px"
};

const descStyle = {
  fontSize: "15px",
  color: "#444",
  marginBottom: "14px"
};

const infoTagStyle = {
  fontSize: "14px",
  color: "#555",
  backgroundColor: "#f2f2f2",
  padding: "10px",
  borderRadius: "8px",
  display: "inline-block"
};

const modalBackdrop = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000
};

const modalContent = {
  backgroundColor: "#fff",
  padding: "30px",
  borderRadius: "12px",
  maxWidth: "600px",
  width: "100%"
};
