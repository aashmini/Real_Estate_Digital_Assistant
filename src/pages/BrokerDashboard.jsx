// BrokerDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ContactList from "../components/ContactList";
import { FaBars } from "react-icons/fa";
export default function BrokerDashboard() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [visits, setVisits] = useState([]);
  const [selectedVisits, setSelectedVisits] = useState([]);
  const [visitModalOpen, setVisitModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [recentPropertyId, setRecentPropertyId] = useState(localStorage.getItem("recentVisitPropertyId") || "");
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showContacts, setShowContacts] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [editingContactId, setEditingContactId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [refreshContacts, setRefreshContacts] = useState(false);
  const [showIPA, setShowIPA] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

const [ipaInput, setIPAInput] = useState({
  purchasePrice: "",
  monthlyRent: "",
  appreciation: ""
});
const [ipaResult, setIPAResult] = useState(null);
const calculateIPA = () => {
  const { purchasePrice, monthlyRent, appreciation } = ipaInput;
  const price = parseFloat(purchasePrice);
  const rent = parseFloat(monthlyRent);
  const appRate = parseFloat(appreciation);
  

  if (isNaN(price) || isNaN(rent) || isNaN(appRate)) {
    alert("Please enter valid numeric values.");
    return;
  }

  const annualRent = rent * 12;
  const capRate = ((annualRent / price) * 100).toFixed(2);
  const roi = (((annualRent + (price * (appRate / 100))) / price) * 100).toFixed(2);

  setIPAResult({ capRate, roi });
};

  const [newContact, setNewContact] = useState({
    email: "",
    firstname: "",
    lastname: ""
  });

  const [newProperty, setNewProperty] = useState({
    title: "",
    price: "",
    location: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    image: ""
  });

  const broker = JSON.parse(localStorage.getItem("currentUser"));
  const brokerId = broker?._id;
  useEffect(() => {
  const handleClickOutside = (e) => {
    if (!e.target.closest(".dropdown-container")) {
      setDropdownOpen(false);
    }
  };
  document.addEventListener("click", handleClickOutside);
  return () => document.removeEventListener("click", handleClickOutside);
}, []);
useEffect(() => {
  const handleClickOutside = (e) => {
    if (!e.target.closest(".dropdown-container")) {
      setDropdownOpen(false);
    }
    if (!e.target.closest(".profile-dropdown-container")) {
      setProfileDropdownOpen(false);
    }
  };
  document.addEventListener("click", handleClickOutside);
  return () => document.removeEventListener("click", handleClickOutside);
}, []);


  useEffect(() => {
    if (!broker || broker.role !== "broker") {
      window.location.href = "/auth?role=broker";
    } else {
      fetchProperties();
      fetchVisits();
    }
  }, []);

  useEffect(() => {
    if (recentPropertyId) {
      const timeout = setTimeout(() => {
        localStorage.removeItem("recentVisitPropertyId");
        setRecentPropertyId("");
      }, 600000);
      return () => clearTimeout(timeout);
    }
  }, [recentPropertyId]);

  useEffect(() => {
    let filtered = properties.filter((prop) =>
      prop.title.toLowerCase().includes(search.toLowerCase()) ||
      prop.location.toLowerCase().includes(search.toLowerCase())
    );
    if (minPrice) filtered = filtered.filter((p) => parseInt(p.price) >= parseInt(minPrice));
    if (maxPrice) filtered = filtered.filter((p) => parseInt(p.price) <= parseInt(maxPrice));
    setFilteredProperties(filtered);
  }, [search, minPrice, maxPrice, properties]);

  const fetchProperties = () => {
    axios
      .get(`http://localhost:5000/api/properties?brokerId=${brokerId}`)
      .then((res) => {
        setProperties(res.data);
        setFilteredProperties(res.data);
      })
      .catch((err) => console.error("Error fetching properties:", err));
  };

  const fetchVisits = () => {
    axios
      .get("http://localhost:5000/api/visits")
      .then((res) => setVisits(res.data))
      .catch((err) => console.error("Error fetching visits:", err));
  };

  const openVisitModal = (propertyId) => {
    const filtered = visits.filter((v) => v.propertyId && v.propertyId._id === propertyId);
    setSelectedVisits(filtered);
    setVisitModalOpen(true);
  };const handleUpdateVisitStatus = (visitId, status) => {
    axios
      .patch(`http://localhost:5000/api/visits/${visitId}`, { status })
      .then(() => {
        const updatedVisits = selectedVisits.map((v) =>
          v._id === visitId ? { ...v, status } : v
        );
        setSelectedVisits(updatedVisits);
        fetchVisits();
      })
      .catch((err) => console.error("Error updating visit status:", err));
  };

const handleAddProperty = () => {
  const missingFields = Object.entries(newProperty).filter(
    ([_, val]) => val === null || val === undefined || String(val).trim() === ""
  );

  if (missingFields.length > 0) {
    alert("Please fill in all fields before adding a property.");
    return;
  }

  axios.post("http://localhost:5000/api/properties", { ...newProperty, brokerId })
    .then(() => {
      setShowModal(false);
      setNewProperty({
        title: "", price: "", location: "",
        bedrooms: "", bathrooms: "", area: "", image: ""
      });
      fetchProperties();
    })
    .catch((err) => {
      alert("Failed to add property");
      console.error(err);
    });
};

  const handleAddContact = async () => {
    try {
      if (editMode && editingContactId) {
        await axios.patch(`http://localhost:5000/api/contacts/${editingContactId}`, newContact);
        alert("✅ Contact updated successfully");
      } else {
        await axios.post("http://localhost:5000/api/contacts", newContact);
        alert("✅ Contact added successfully");
      }
      setNewContact({ email: "", firstname: "", lastname: "" });
      setEditingContactId(null);
      setEditMode(false);
      setContactModalOpen(false);
      setRefreshContacts((prev) => !prev);
    } catch (err) {
      console.error("Error saving contact:", err);
      alert("❌ Failed to save contact");
    }
  };
  
  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
  <h2 style={styles.title}>Broker Dashboard</h2>
  
  <div style={styles.headerRight}>
    {/* Menu Button */}
    <div style={{ position: "relative" }} className="dropdown-container">
      <button style={styles.navButton} onClick={(e) => {
        e.stopPropagation();
        setDropdownOpen(!dropdownOpen);
      }}>
        <FaBars /> Menu
      </button>
      {dropdownOpen && (
        <div style={styles.dropdownMenu}>
          <div style={styles.dropdownItem} onClick={() => navigate("/meetings")}>📅 Meetings</div>
          <div style={styles.dropdownItem} onClick={() => setShowIPA(true)}>📈 Investment Analyzer</div>
          <div style={styles.dropdownItem} onClick={() => navigate("/decks")}>🗂 Decks</div>
          <div style={styles.dropdownItem} onClick={() => navigate("/analytics")}>📊 Analytics</div>
          <div style={styles.dropdownItem} onClick={() => setShowContacts(true)}>👥 Client Contacts</div>
        </div>
      )}
    </div>

    {/* Profile Button */}
    <div style={{ position: "relative" }} className="profile-dropdown-container">
      <button style={styles.navButton} onClick={(e) => {
        e.stopPropagation();
        setProfileDropdownOpen(!profileDropdownOpen);
      }}>
        👤 Profile
      </button>
      {profileDropdownOpen && (
        <div style={styles.dropdownMenu}>
          <div style={styles.dropdownItem} onClick={() => navigate("/edit-profile")}>📝 Edit Profile</div>
          <div
            style={styles.dropdownItem}
            onClick={() => {
              localStorage.clear();
              window.location.href = "/auth?role=broker";
            }}
          >
            🚪 Logout
          </div>
        </div>
      )}
    </div>
  </div>
</header>



      {/* Filters */}
      <section style={{ padding: "40px 24px" }}>
        <h3 style={styles.sectionTitle}>Your Properties</h3>
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
          <input type="text" placeholder="Search by title or location" value={search} onChange={(e) => setSearch(e.target.value)} style={styles.input} />
          <input type="number" placeholder="Min Price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} style={styles.input} />
          <input type="number" placeholder="Max Price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} style={styles.input} />
        </div>

        <div style={styles.headerRight}>
          <button style={styles.btnPrimary} onClick={() => setShowModal(true)}>+ Add Property</button>
          <button style={styles.btnPrimary} onClick={() => { setEditMode(false); setNewContact({ email: "", firstname: "", lastname: "" }); setContactModalOpen(true); }}>➕ Add Contact</button>
        </div>

        {/* Property Cards */}
        <div style={styles.cardGrid}>
          {filteredProperties.length === 0 ? (
            <p style={{ color: "#666" }}>No matching properties found.</p>
          ) : (
            filteredProperties.map((prop, i) => (
              <div key={i} style={{ ...styles.card, position: "relative" }}>
                {recentPropertyId === prop._id && <div style={styles.newVisitBadge}>New Visit Scheduled</div>}
                <button style={styles.mapBtn} onClick={() => { setSelectedLocation(prop.location); setShowMap(true); }}>🗺 Map</button>
                <div style={{ width: "100%", height: "180px", backgroundImage: `url(${prop.image || `https://source.unsplash.com/400x300/?apartment,house&sig=${i}`})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                <div style={styles.cardContent}>
                  <h4 style={styles.cardTitle}>{prop.title}</h4>
                  <p style={styles.cardText}>₹ {parseInt(prop.price).toLocaleString("en-IN")}</p>
                  <p style={styles.cardText}>{prop.location}</p>
                  <p style={styles.cardSubtext}>{prop.bedrooms} BHK • {prop.area} sq.ft • {prop.bathrooms} Bath</p>
                  <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <button style={{ ...styles.btnPrimary, flex: 1 }} onClick={() => navigate(`/property/${prop._id}`)}>View Details</button>
                    <button style={{ ...styles.btnSecondary, flex: 1 }} onClick={() => openVisitModal(prop._id)}>View Visits</button>
                  </div>
                </div>
                {/* Document Upload and Compliance Checklist */}
<div style={{ padding: "10px", borderTop: "1px solid #ddd", marginTop: "12px" }}>
  <strong style={{ color: "#0F4C5C" }}>📁 Compliance Documents</strong>
  <input
    type="file"
    onChange={(e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const docs = JSON.parse(localStorage.getItem(`broker_docs_${prop._id}`) || "[]");
          docs.push({ name: file.name, dataUrl: reader.result });
          localStorage.setItem(`broker_docs_${prop._id}`, JSON.stringify(docs));
          setProperties((prev) => [...prev]); // re-render
        };
        reader.readAsDataURL(file);
      }
    }}
    style={{ marginTop: "6px", marginBottom: "10px", display: "block" }}
  />
  <ul style={{ paddingLeft: "16px", marginBottom: "10px" }}>
    {(JSON.parse(localStorage.getItem(`broker_docs_${prop._id}`) || "[]") || []).map((doc, idx) => (
      <li key={idx}>
        <a href={doc.dataUrl} download={doc.name} style={{ color: "#0F4C5C" }}>{doc.name}</a>
      </li>
    ))}
  </ul>

  <div>
    <strong style={{ color: "#0F4C5C" }}>✅ Compliance Checklist</strong>
    {["Title Deed", "Encumbrance Cert.", "Electricity Bill"].map((item, idx) => {
      const checked = JSON.parse(localStorage.getItem(`broker_check_${prop._id}_${idx}`) || "false");
      return (
        <div key={idx}>
          <label style={{ fontSize: "14px" }}>
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => {
                localStorage.setItem(`broker_check_${prop._id}_${idx}`, e.target.checked);
                setProperties((prev) => [...prev]);
              }}
              style={{ marginRight: "6px" }}
            />
            {item}
          </label>
        </div>
      );
    })}
  </div>
</div>

              </div>
            ))
          )}
        </div>
      </section>

       {/* Visit Modal */}
      {visitModalOpen && (
  <div style={styles.modalOverlay}>
    <div style={{ ...styles.modalBox, width: "500px", maxHeight: "80vh", overflowY: "auto" }}>
      <h3 style={{ marginBottom: "16px", color: "#0F4C5C" }}>Scheduled Visits</h3>
      {[...selectedVisits]
        .sort((a, b) => {
          const statusPriority = { "Pending": 0, "Accepted": 1, "Rejected": 2 };
          const statusA = statusPriority[a.status] ?? 3;
          const statusB = statusPriority[b.status] ?? 3;
          if (statusA !== statusB) return statusA - statusB;

          const dateA = new Date(`${a.date}T${a.time}`);
          const dateB = new Date(`${b.date}T${b.time}`);
          return dateB - dateA; // latest first
        })
        .map((visit, index) => (
          <div key={index} style={styles.visitCard}>
            <div style={styles.visitCardRow}>
              <strong>User:</strong> {visit.userId?.name || visit.userId?.email}
            </div>
            <div style={styles.visitCardRow}>
              <strong>Date:</strong> {visit.date}
            </div>
            <div style={styles.visitCardRow}>
              <strong>Time:</strong> {visit.time}
            </div>
            <div style={styles.visitCardRow}>
              <strong>Status:</strong>
              <span
                style={{
                  marginLeft: "8px",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  backgroundColor:
                    visit.status === "Accepted"
                      ? "#DFF5E1"
                      : visit.status === "Rejected"
                      ? "#F8D7DA"
                      : "#FFF1C9",
                  color:
                    visit.status === "Accepted"
                      ? "#2E7D32"
                      : visit.status === "Rejected"
                      ? "#C62828"
                      : "#946200",
                  fontWeight: "600"
                }}
              >
                {visit.status}
              </span>
            </div>
            {visit.status === "Pending" && (
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button
                  style={{ ...styles.btnPrimary, padding: "6px 12px", fontSize: "13px" }}
                  onClick={() => handleUpdateVisitStatus(visit._id, "Accepted")}
                >
                  Approve
                </button>
                <button
                  style={{ ...styles.btnSecondary, padding: "6px 12px", fontSize: "13px" }}
                  onClick={() => handleUpdateVisitStatus(visit._id, "Rejected")}
                >
                  Reject
                </button>
              </div>
            )}
            <hr style={{ margin: "16px 0", borderColor: "#eee" }} />
          </div>
        ))}
      <div style={{ textAlign: "right" }}>
        <button style={styles.btnSecondary} onClick={() => setVisitModalOpen(false)}>Close</button>
      </div>
    </div>
  </div>
)}
      {/* Contact List Modal */}
      {showContacts && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h3 style={{ color: "#0F4C5C", marginBottom: "16px" }}>Your CRM Contacts</h3>
            <ContactList
              refresh={refreshContacts}
              onEdit={(contact) => {
                setEditMode(true);
                setNewContact({
                  email: contact.properties.email,
                  firstname: contact.properties.firstname,
                  lastname: contact.properties.lastname
                });
                setEditingContactId(contact.id);
                setContactModalOpen(true);
              }}
              onDelete={async (id) => {
                if (window.confirm("Are you sure you want to delete this contact?")) {
                  try {
                    await axios.delete(`http://localhost:5000/api/contacts/${id}`);
                    alert("✅ Contact deleted");
                    setRefreshContacts((prev) => !prev);
                  } catch (err) {
                    alert("❌ Failed to delete contact");
                  }
                }
              }}
            />
            <div style={{ textAlign: "right", marginTop: "20px" }}>
              <button style={styles.btnSecondary} onClick={() => setShowContacts(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Contact Modal */}
      {contactModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h3 style={{ marginBottom: "16px", color: "#0F4C5C" }}>
              {editMode ? "Edit Contact" : "Add New Contact"}
            </h3>
            {["email", "firstname", "lastname"].map((field) => (
              <input
                key={field}
                type="text"
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={newContact[field]}
                onChange={(e) => setNewContact({ ...newContact, [field]: e.target.value })}
                style={styles.input}
              />
            ))}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
              <button style={styles.btnSecondary} onClick={() => setContactModalOpen(false)}>Cancel</button>
              <button style={styles.btnPrimary} onClick={handleAddContact}>
                {editMode ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

            {/* Add Property Modal */}
{showModal && (
  <div style={styles.modalOverlay}>
    <div style={styles.modalBox}>
      <h3 style={{ marginBottom: "16px", color: "#0F4C5C" }}>Add New Property</h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {["title", "price", "location", "bedrooms", "bathrooms", "area", "image"].map((field) => (
          <input
            key={field}
            type={["price", "bedrooms", "bathrooms", "area"].includes(field) ? "number" : "text"}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={newProperty[field]}
            onChange={(e) => setNewProperty({ ...newProperty, [field]: e.target.value })}
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "14px"
            }}
          />
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
        <button style={styles.btnSecondary} onClick={() => setShowModal(false)}>Cancel</button>
        <button style={styles.btnPrimary} onClick={handleAddProperty}>Add</button>
      </div>
    </div>
  </div>
)}

       {/* Map Modal */}
      {showMap && selectedLocation && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modalBox, width: "80%", height: "500px", padding: 0 }}>
            <div style={{ padding: "16px", backgroundColor: "#0F4C5C", color: "#fff", display: "flex", justifyContent: "space-between" }}>
              <h3 style={{ margin: 0 }}>Map View: {selectedLocation}</h3>
              <button style={styles.btnSecondary} onClick={() => setShowMap(false)}>Close</button>
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
      
      {/* IPA Modal */}
{showIPA && (
  <div style={styles.modalOverlay}>
    <div style={styles.modalBox}>
      <h3 style={{ marginBottom: "16px", color: "#0F4C5C" }}>Investment Potential Analyzer</h3>
      {["purchasePrice", "monthlyRent", "appreciation"].map((field) => (
        <input
          key={field}
          type="number"
          placeholder={field === "purchasePrice" ? "Purchase Price (₹)" : field === "monthlyRent" ? "Monthly Rent (₹)" : "Appreciation (%)"}
          value={ipaInput[field]}
          onChange={(e) => setIPAInput({ ...ipaInput, [field]: e.target.value })}
          style={styles.input}
        />
      ))}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
        <button style={styles.btnSecondary} onClick={() => setShowIPA(false)}>Close</button>
        <button style={styles.btnPrimary} onClick={calculateIPA}>Analyze</button>
      </div>
      {ipaResult && (
        <div style={{ marginTop: "20px", color: "#0F4C5C" }}>
          <p><strong>Cap Rate:</strong> {ipaResult.capRate}%</p>
          <p><strong>Estimated ROI (1 Yr):</strong> {ipaResult.roi}%</p>
        </div>
      )}
    </div>
  </div>
)}

    </div>
    
  );
}

// styles remain unchanged

// STYLES
const styles = {
  page: {
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: "#fef9f4",
    minHeight: "100vh"
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
  flexDirection: "column", // ensures vertical stacking
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
  title: {
  fontSize: "26px",
  fontFamily: "'Playfair Display', serif",
  margin: 0
},
  headerRight: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap"
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
  btnPrimary: {
    backgroundColor: "#E0B973",
    color: "#0F4C5C",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "none",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer"
  },
  btnSecondary: {
    backgroundColor: "#fff",
    color: "#0F4C5C",
    border: "1px solid #E0B973",
    padding: "10px 14px",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer"
  },
  sectionTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "24px",
    marginBottom: "30px",
    color: "#0F4C5C",
    textAlign: "center"
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
    flex: 1,
    minWidth: "180px"
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "24px"
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
    overflow: "hidden",
    transition: "transform 0.3s",
    cursor: "pointer"
  },
  cardContent: {
    padding: "16px"
  },
  cardTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#0F4C5C",
    marginBottom: "6px"
  },
  cardText: {
    margin: "4px 0",
    color: "#444",
    fontSize: "14px",
    fontWeight: "500"
  },
  cardSubtext: {
    fontSize: "12px",
    color: "#888",
    marginTop: "4px"
  },
  newVisitBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#FFF3CD",
    color: "#856404",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600"
  },
  mapBtn: {
    position: "absolute",
    top: "10px",
    right: "10px",
    zIndex: 1,
    backgroundColor: "#fff",
    color: "#0F4C5C",
    border: "1px solid #E0B973",
    padding: "6px 10px",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer"
  },
  modalOverlay: {
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
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "12px",
    width: "400px",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 0 20px rgba(0,0,0,0.2)"
  },
   cardWithVisits: {
  border: "2px solid #E0B973",
  boxShadow: "0 0 12px rgba(224, 185, 115, 0.4)"
}

};
