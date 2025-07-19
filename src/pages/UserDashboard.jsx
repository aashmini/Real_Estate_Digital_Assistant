import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({ location: "", bhk: "", budget: "" });
  const [showModal, setShowModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("");
  const [justScheduledId, setJustScheduledId] = useState(localStorage.getItem("justScheduled"));
  const [showIPAModal, setShowIPAModal] = useState(false);
  const [selectedIPAProperty, setSelectedIPAProperty] = useState(null);
  const [selectedForComparison, setSelectedForComparison] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [bookmarked, setBookmarked] = useState([]);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [currentProperty, setCurrentProperty] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [showChatbot, setShowChatbot] = useState(false);
  const [showMap, setShowMap] = useState(false);
const [selectedLocation, setSelectedLocation] = useState(null);

  const [complianceStatus, setComplianceStatus] = useState(() => {
  return JSON.parse(localStorage.getItem("complianceStatus")) || {};
});

const [propertyDocs, setPropertyDocs] = useState(() => {
  return JSON.parse(localStorage.getItem("propertyDocs")) || {};
});

  

  useEffect(() => {
    fetchProperties();
    const storedBookmarks = JSON.parse(localStorage.getItem("bookmarkedProperties")) || [];
    setBookmarked(storedBookmarks);
  }, [filters]);

  useEffect(() => {
    if (justScheduledId) {
      const timer = setTimeout(() => {
        localStorage.removeItem("justScheduled");
        setJustScheduledId(null);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [justScheduledId]);
  

useEffect(() => {
  localStorage.setItem("complianceStatus", JSON.stringify(complianceStatus));
}, [complianceStatus]);

useEffect(() => {
  localStorage.setItem("propertyDocs", JSON.stringify(propertyDocs));
}, [propertyDocs]);

  const fetchProperties = () => {
    const query = new URLSearchParams(filters).toString();
    axios.get(`http://localhost:5000/api/properties?${query}`)
      .then((res) => {
        const withGreenScore = res.data.map((prop) => ({
          ...prop,
          greenScore: prop.greenScore || Math.floor(Math.random() * 100)
        }));
        setProperties(withGreenScore);
      })
      .catch((err) => console.error("Error fetching properties:", err));
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSchedule = (property) => {
    setSelectedProperty(property);
    setShowModal(true);
  };

  const submitVisit = () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return alert("User not logged in");

    const visitDetails = {
      userId,
      propertyId: selectedProperty._id,
      date: visitDate,
      time: visitTime
    };

    axios.post("http://localhost:5000/api/visits", visitDetails)
      .then(() => {
        alert("Visit scheduled successfully");
        localStorage.setItem("justScheduled", selectedProperty._id);
        setJustScheduledId(selectedProperty._id);
        setShowModal(false);
        setVisitDate("");
        setVisitTime("");
        sendToCRM(visitDetails);
      }).catch(() => {
        alert("Failed to schedule visit");
      });
  };

  const calculateInvestmentMetrics = (property) => {
    const price = parseFloat(property.price);
    const rentPerMonth = price * 0.005;
    const yearlyRent = rentPerMonth * 12;
    const capRate = ((yearlyRent / price) * 100).toFixed(2);
    const roi = ((yearlyRent * 5) / price * 100).toFixed(2);
    const appreciation = (price * 1.25).toLocaleString("en-IN");
    return {
      rentPerMonth: rentPerMonth.toLocaleString("en-IN"),
      yearlyRent: yearlyRent.toLocaleString("en-IN"),
      capRate,
      roi,
      appreciation
    };
  };

  const toggleSelectForComparison = (propId) => {
    setSelectedForComparison((prev) => {
      if (prev.includes(propId)) return prev.filter((id) => id !== propId);
      if (prev.length < 3) return [...prev, propId];
      alert("You can compare only 3 properties at a time");
      return prev;
    });
  };

  const selectedProperties = properties.filter(p => selectedForComparison.includes(p._id));
  const handleDocUpload = (propertyId, file) => {
  const fileURL = URL.createObjectURL(file);
  const updated = { ...propertyDocs, [propertyId]: fileURL };
  setPropertyDocs(updated);
};

const handleChecklistToggle = (propertyId, item) => {
  const updated = { ...complianceStatus };
  if (!updated[propertyId]) updated[propertyId] = {};
  updated[propertyId][item] = !updated[propertyId][item];
  setComplianceStatus(updated);
};
 const sendToCRM = (visitDetails) => {
    axios.post('https://hook.eu2.make.com/ggc4v3lqdkhwnf6engqrvqvdu8bukjd6', visitDetails)
      .then(response => {
        console.log('CRM data sent successfully:', response.data);
        alert('CRM updated!');
      })
      .catch(error => {
        console.error('Error sending CRM data:', error);
        alert('Visit scheduled');
      });
  };

  const toggleBookmark = (property) => {
    let updated = [...bookmarked];
    const exists = updated.find((p) => p._id === property._id);
    if (exists) {
      updated = updated.filter((p) => p._id !== property._id);
    } else {
      updated.push(property);
    }
    setBookmarked(updated);
    localStorage.setItem("bookmarkedProperties", JSON.stringify(updated));
  };

  const isBookmarked = (property) =>
    bookmarked.find((p) => p._id === property._id);

  const submitReview = () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return alert("Login required");
    axios.post("http://localhost:5000/api/reviews", {
      userId,
      propertyId: currentProperty._id,
      review: reviewText
    }).then(() => {
      alert("Review submitted");
      setReviewModalOpen(false);
      setReviewText("");
    }).catch(() => alert("Failed to submit review"));
  };
const renderChecklist = (prop) => {
  const checklistItems = [
    "Sale Deed",
    "Tax Receipts",
    "Encumbrance Certificate",
    "Khata Certificate"
  ];
  return (
    <div style={{ background: "#f7f7f7", border: "1px solid #ccc", padding: "12px", marginTop: "14px", borderRadius: "6px" }}>
      <h5 style={{ marginBottom: "8px", fontSize: "15px", color: "#0F4C5C" }}>📄 Compliance & Docs</h5>
      <input type="file" onChange={(e) => handleDocUpload(prop._id, e.target.files[0])} />
      {propertyDocs[prop._id] && (
        <div style={{ marginTop: "8px" }}>
          <a href={propertyDocs[prop._id]} target="_blank" rel="noopener noreferrer" style={{ color: "#007bff" }}>View Uploaded Doc</a>
        </div>
      )}
      <ul style={{ listStyle: "none", padding: 0, marginTop: "8px" }}>
        {checklistItems.map((item, idx) => (
          <li key={idx}>
            <label style={{ fontSize: "13px" }}>
              <input
                type="checkbox"
                checked={complianceStatus[prop._id]?.[item] || false}
                onChange={() => handleChecklistToggle(prop._id, item)}
                style={{ marginRight: "6px" }}
              />
              {item}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
  
};

  return (
  <div style={{ fontFamily: "'Poppins', sans-serif", backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
    <header style={{ backgroundColor: "#0F4C5C", color: "#fff", padding: "16px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "26px" }}>Welcome to Real Agent</h2>
      <div style={{ display: "flex", gap: "12px" }}>
        <button onClick={() => navigate("/my-visits")} style={{ ...btnPrimary, backgroundColor: "#fff", color: "#0F4C5C", border: "1px solid #E0B973" }}>My Visits</button>
        <button onClick={() => navigate("/bookmarks")} style={btnPrimary}>⭐ Bookmarks</button>
        <button onClick={() => { localStorage.clear(); navigate("/auth?role=user"); }} style={btnPrimary}>Logout</button>
      </div>
    </header>

    {/* Filters */}
    <div style={{ backgroundColor: "#fff", padding: "20px 40px", display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
      <input name="location" value={filters.location} onChange={handleFilterChange} placeholder="Location" style={filterInput} />
      <select name="bhk" value={filters.bhk} onChange={handleFilterChange} style={filterInput}>
        <option value="">BHK</option><option value="1">1 BHK</option><option value="2">2 BHK</option><option value="3">3 BHK</option>
      </select>
      <select name="budget" value={filters.budget} onChange={handleFilterChange} style={filterInput}>
        <option value="">Budget</option><option value="3000000">Up to ₹30 Lakhs</option><option value="6000000">Up to ₹60 Lakhs</option><option value="10000000">Up to ₹1 Cr</option>
      </select>
      <button onClick={fetchProperties} style={{ ...btnPrimary, padding: "10px 18px" }}>Apply Filters</button>
      {selectedForComparison.length >= 2 && (
        <button style={{ ...btnPrimary, marginLeft: "auto" }} onClick={() => setShowCompareModal(true)}>🔍 Compare ({selectedForComparison.length})</button>
      )}
    </div>

    {/* Property Cards */}
    <section style={{ padding: "40px" }}>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", marginBottom: "30px", color: "#0F4C5C", textAlign: "center" }}>Featured Properties</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
       

        {properties.length === 0 ? (
          <p style={{ gridColumn: "1/-1", textAlign: "center", color: "#888" }}>No properties found.</p>
        ) : (
          properties.sort((a, b) => (a._id === justScheduledId ? -1 : 0)).map((prop, index) => (
            <div key={index} style={{
              backgroundColor: "#fff", border: prop._id === justScheduledId ? "2px solid #4caf50" : "none",
              borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", overflow: "hidden", transition: "transform 0.3s", position: "relative"
            }}>
              {prop._id === justScheduledId && (
                <div style={{
                  position: "absolute", top: "10px", left: "10px", backgroundColor: "#4caf50",
                  color: "#fff", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "600"
                }}>Visit Scheduled</div>
              )}
              {/* Map Button */}
<button
  onClick={() => {
    setSelectedLocation(prop.location);
    setShowMap(true);
  }}
  style={{
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "#0F4C5C",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
  }}
>
  🗺️ Map
</button>

              <div style={{
                width: "100%", height: "180px",
                backgroundImage: `url(${prop.image || `https://source.unsplash.com/400x300/?real-estate,home&sig=${index}`})`,
                backgroundSize: "cover", backgroundPosition: "center"
              }} />
              <div style={{ padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label style={{ fontSize: "12px", color: "#555" }}>
                    <input type="checkbox" checked={selectedForComparison.includes(prop._id)} onChange={() => toggleSelectForComparison(prop._id)} /> Compare
                  </label>
                  <button style={btnSecondary} onClick={() => { setSelectedIPAProperty(prop); setShowIPAModal(true); }}>📈 Analyze Investment</button>
                </div>
                <h4 style={{ fontSize: "18px", marginBottom: "8px", color: "#0F4C5C" }}>{prop.title}</h4>
                <p style={{ margin: "4px 0", fontWeight: "500", color: "#333" }}>₹ {prop.price.toLocaleString("en-IN")}</p>
                <p style={{ margin: "4px 0", color: "#666" }}>{prop.location}</p>
                <p style={{ fontSize: "13px", color: "#888", marginTop: "4px" }}>{prop.bedrooms} BHK • {prop.area} sq.ft • {prop.bathrooms} Bath</p>
                <div style={{ marginTop: "10px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "500", color: "#0F4C5C" }}>Green Score</label>
                  <div style={{ height: "10px", width: "100%", backgroundColor: "#e0e0e0", borderRadius: "5px", overflow: "hidden", marginTop: "4px" }}>
                    <div style={{
                      width: `${prop.greenScore || 0}%`, height: "100%",
                      backgroundColor: prop.greenScore >= 70 ? "#4caf50" : prop.greenScore >= 40 ? "#ffc107" : "#f44336"
                    }} />
                  </div>
                  <div style={{ fontSize: "12px", color: "#555", marginTop: "4px" }}>{prop.greenScore || 0}/100</div>
                </div>
                <div style={{ display: "flex", gap: "12px", marginTop: "12px", flexWrap: "wrap" }}>
                  
                  <button style={btnPrimary} onClick={() => handleSchedule(prop)}>Schedule Visit</button>
                  <button style={btnSecondary} onClick={() => toggleBookmark(prop)}>
                    {isBookmarked(prop) ? "★ Bookmarked" : "☆ Bookmark"}
                  </button>
                  <button style={btnSecondary} onClick={() => {
                    setCurrentProperty(prop);
                    setReviewModalOpen(true);
                  }}>✍️ Review</button>
                </div>
                {renderChecklist(prop)}
                
              </div>
            </div>
          ))
        )}
      </div>
    </section>

    {/* Compare Modal */}
    {showCompareModal && (
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999 }}>
        <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "10px", width: "90%", maxHeight: "80vh", overflowY: "auto" }}>
          <h3 style={{ color: "#0F4C5C", marginBottom: "20px" }}>📊 Property Comparison</h3>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr style={{ backgroundColor: "#f1f1f1", textAlign: "left" }}>
                <th style={thStyle}>Feature</th>
                {selectedProperties.map((p, i) => (<th key={i} style={thStyle}>{p.title}</th>))}
              </tr>
            </thead>
            <tbody>
              <tr><td style={tdStyle}>📍 Location</td>{selectedProperties.map((p, i) => <td key={i} style={tdStyle}>{p.location}</td>)}</tr>
              <tr><td style={tdStyle}>💰 Price</td>{selectedProperties.map((p, i) => <td key={i} style={tdStyle}>₹ {p.price.toLocaleString("en-IN")}</td>)}</tr>
              <tr><td style={tdStyle}>🛏️ Bedrooms</td>{selectedProperties.map((p, i) => <td key={i} style={tdStyle}>{p.bedrooms}</td>)}</tr>
              <tr><td style={tdStyle}>🛁 Bathrooms</td>{selectedProperties.map((p, i) => <td key={i} style={tdStyle}>{p.bathrooms}</td>)}</tr>
              <tr><td style={tdStyle}>📐 Area</td>{selectedProperties.map((p, i) => <td key={i} style={tdStyle}>{p.area} sq.ft</td>)}</tr>
              <tr><td style={tdStyle}>🌱 Green Score</td>{selectedProperties.map((p, i) => <td key={i} style={tdStyle}>{p.greenScore}/100</td>)}</tr>
            </tbody>
          </table>
          <div style={{ textAlign: "right", marginTop: "20px" }}>
            <button style={btnSecondary} onClick={() => setShowCompareModal(false)}>Close</button>
          </div>
        </div>
      </div>
    )}
{showMap && selectedLocation && (
  <div style={{
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999
  }}>
    <div style={{
      backgroundColor: "#fff",
      borderRadius: "12px",
      width: "80%",
      height: "500px",
      overflow: "hidden",
      boxShadow: "0 0 20px rgba(0,0,0,0.2)"
    }}>
      <div style={{
        padding: "16px",
        backgroundColor: "#0F4C5C",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between"
      }}>
        <h3 style={{ margin: 0 }}>Map View: {selectedLocation}</h3>
        <button
          onClick={() => setShowMap(false)}
          style={{
            backgroundColor: "#fff",
            color: "#0F4C5C",
            border: "1px solid #E0B973",
            padding: "6px 12px",
            borderRadius: "6px",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          Close
        </button>
      </div>
      <iframe
        src={`https://www.google.com/maps?q=${encodeURIComponent(selectedLocation)}&output=embed`}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        title="Property Map"
      />
    </div>
  </div>
)}

    {/* Schedule Visit Modal */}
    {showModal && (
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
        <div style={{ background: "#fff", padding: "30px", borderRadius: "10px", width: "350px", boxShadow: "0 0 10px rgba(0,0,0,0.3)" }}>
          <h4 style={{ marginBottom: "20px", color: "#0F4C5C" }}>Schedule a Visit</h4>
          <input type="date" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} style={filterInput} />
          <input type="time" value={visitTime} onChange={(e) => setVisitTime(e.target.value)} style={{ ...filterInput, marginTop: "10px" }} />
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px", gap: "10px" }}>
            <button style={btnSecondary} onClick={() => setShowModal(false)}>Cancel</button>
            <button style={btnPrimary} onClick={submitVisit}>Confirm</button>
          </div>
        </div>
      </div>
    )}

    {/* Review Modal */}
      {reviewModalOpen && (
        <div style={modalOverlay}>
          <div style={{ ...modalBox, width: "400px" }}>
            <h4 style={modalTitle}>Review for {currentProperty?.title}</h4>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your review..."
              style={{
                width: "100%", height: "80px", padding: "10px",
                borderRadius: "6px", border: "1px solid #ccc"
              }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px", gap: "10px" }}>
              <button style={btnSecondary} onClick={() => setReviewModalOpen(false)}>Cancel</button>
              <button style={btnPrimary} onClick={submitReview}>Submit</button>
            </div>
          </div>
        </div>
      )}
    {/* Floating Chatbot Button - Bottom-Left */}
      <button
        onClick={() => setShowChatbot(!showChatbot)}
        style={{
          position: "fixed",
          bottom: "20px",
          left: "20px",
          backgroundColor: "#0F4C5C",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          fontSize: "24px",
          cursor: "pointer",
          zIndex: 1001,
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)"
        }}
      >
        💬
      </button>

      {/* Chatbot Frame */}
      {showChatbot && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            left: "20px",
            width: "350px",
            height: "500px",
            border: "2px solid #ccc",
            borderRadius: "10px",
            backgroundColor: "#fff",
            zIndex: 1000,
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.25)"
          }}
        >
          <div style={{ textAlign: "right", padding: "6px" }}>
            <button
              onClick={() => setShowChatbot(false)}
              style={{
                background: "none",
                border: "none",
                fontSize: "18px",
                cursor: "pointer",
                color: "#0F4C5C",
                fontWeight: "bold"
              }}
              title="Close"
            >
              ✖
            </button>
          </div>
          <iframe
            src="http://127.0.0.1:5000/chat"
            title="Chatbot"
            style={{
              width: "100%",
              height: "92%",
              border: "none",
              borderRadius: "0 0 10px 10px"
            }}
          />
        </div>
      )}

    {/* IPA Modal */}
    {showIPAModal && selectedIPAProperty && (
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999 }}>
        <div style={{ backgroundColor: "#fff", padding: "30px", borderRadius: "10px", width: "400px", maxHeight: "80vh", overflowY: "auto" }}>
          <h3 style={{ color: "#0F4C5C" }}>Investment Potential: {selectedIPAProperty.title}</h3>
          <p>📍 <strong>{selectedIPAProperty.location}</strong></p>
          <p>💰 Price: ₹ {selectedIPAProperty.price.toLocaleString("en-IN")}</p>
          <hr />
          {(() => {
            const { rentPerMonth, yearlyRent, capRate, roi, appreciation } = calculateInvestmentMetrics(selectedIPAProperty);
            return (
              <ul style={{ listStyle: "none", padding: 0, fontSize: "15px", lineHeight: "1.8" }}>
                <li>📦 Estimated Monthly Rent: ₹ {rentPerMonth}</li>
                <li>💸 Yearly Rent: ₹ {yearlyRent}</li>
                <li>📊 Capitalization Rate (Cap Rate): {capRate}%</li>
                <li>📈 Estimated 5-Year ROI: {roi}%</li>
                <li>📈 Projected Price After 5 Years: ₹ {appreciation}</li>
              </ul>
            );
          })()}
          <div style={{ textAlign: "right", marginTop: "20px" }}>
            <button style={btnSecondary} onClick={() => setShowIPAModal(false)}>Close</button>
          </div>
        </div>
      </div>
    )}
  </div>
);
}

const btnPrimary = {
  padding: "6px 12px",
  backgroundColor: "#E0B973",
  border: "none",
  borderRadius: "6px",
  fontWeight: "600",
  fontSize: "14px",
  cursor: "pointer",
  color: "#0F4C5C"
};

const thStyle = {
  padding: "12px",
  border: "1px solid #ccc",
  fontWeight: "600",
  backgroundColor: "#f9f9f9",
  textAlign: "left"
};

const tdStyle = {
  padding: "12px",
  border: "1px solid #ccc",
  textAlign: "left"
};

const btnSecondary = {
  padding: "6px 12px",
  backgroundColor: "#f1f5f9",
  border: "1px solid #ccc",
  borderRadius: "6px",
  fontWeight: "500",
  fontSize: "14px",
  cursor: "pointer"
};

const filterInput = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  minWidth: "150px"
};

const modalOverlay = {
  position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
  alignItems: "center", justifyContent: "center", zIndex: 999
};

const modalBox = {
  background: "#fff", padding: "30px", borderRadius: "10px",
  width: "350px", boxShadow: "0 0 10px rgba(0,0,0,0.3)"
};

const modalTitle = {
  marginBottom: "16px", color: "#0F4C5C"
};
