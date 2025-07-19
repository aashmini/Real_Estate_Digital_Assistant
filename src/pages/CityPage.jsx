export default function CityPage() {
  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      {/* Top Nav */}
      <header style={{ backgroundColor: "#ffffff", padding: "15px 30px", display: "flex", justifyContent: "space-between", borderBottom: "1px solid #ddd" }}>
        <h1 style={{ fontSize: "24px", color: "#1e293b" }}>CRE Assistant</h1>
        <nav style={{ display: "flex", gap: "20px" }}>
          <span style={navLink}>Buy</span>
          <span style={navLink}>Rent</span>
          <span style={navLink}>Commercial</span>
          <span style={navLink}>Projects</span>
          <button style={buttonStyle}>Login</button>
          <button style={{ ...buttonStyle, backgroundColor: "#1e293b", color: "#fff" }}>Sign Up</button>
        </nav>
      </header>

      {/* Search Bar */}
      <div style={{ padding: "20px 30px", backgroundColor: "#f1f5f9" }}>
        <form style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
          <select style={selectStyle}><option>Hyderabad</option></select>
          <select style={selectStyle}><option>Budget</option></select>
          <select style={selectStyle}><option>Property Type</option></select>
          <select style={selectStyle}><option>BHK</option></select>
          <button style={searchBtn}>Search</button>
        </form>
      </div>

      {/* Listings Grid */}
      <div style={{ padding: "30px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
        {dummyProperties.map((property, idx) => (
          <div key={idx} style={cardStyle}>
            <img src={property.image} alt="property" style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "6px" }} />
            <h3 style={{ fontSize: "18px", marginTop: "10px" }}>{property.title}</h3>
            <p style={{ fontSize: "16px", fontWeight: "bold", color: "#1e293b" }}>{property.price}</p>
            <p style={{ fontSize: "14px", color: "#555" }}>{property.location}</p>
            <p style={{ fontSize: "13px", color: "#888" }}>{property.details}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const navLink = {
  color: "#1e293b",
  fontWeight: "500",
  cursor: "pointer",
};

const buttonStyle = {
  backgroundColor: "#facc15",
  padding: "8px 14px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
};

const selectStyle = {
  padding: "8px 12px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const searchBtn = {
  padding: "8px 20px",
  backgroundColor: "#facc15",
  color: "#1e293b",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "600",
};

const cardStyle = {
  backgroundColor: "#fff",
  padding: "15px",
  borderRadius: "10px",
  boxShadow: "0 0 6px rgba(0,0,0,0.1)",
};

// Dummy property data
const dummyProperties = [
  {
    title: "2 BHK in Gachibowli",
    price: "₹56 Lakhs",
    location: "Gachibowli, Hyderabad",
    image: "https://source.unsplash.com/featured/?apartment",
    details: "2 BHK · 1200 sq.ft · East Facing",
  },
  {
    title: "3 BHK in Madhapur",
    price: "₹84 Lakhs",
    location: "Madhapur, Hyderabad",
    image: "https://source.unsplash.com/featured/?home",
    details: "3 BHK · 1800 sq.ft · West Facing",
  },
  {
    title: "Studio in Hitech City",
    price: "₹32 Lakhs",
    location: "Hitech City, Hyderabad",
    image: "https://source.unsplash.com/featured/?studio",
    details: "1 RK · 600 sq.ft · North Facing",
  },
];
