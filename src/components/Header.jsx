import React, { useState } from "react";
import ContactList from "./ContactList"; // Make sure this path is correct

export default function Header() {
  const today = new Date().toLocaleString();
  const [showContacts, setShowContacts] = useState(false);

  return (
    <header
      style={{
        backgroundColor: "#fff",
        padding: "15px 25px",
        borderBottom: "1px solid #eee",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontFamily: "'Poppins', sans-serif",
        flexWrap: "wrap",
      }}
    >
      <div>
        <h2 style={{ fontSize: "20px", margin: 0, color: "#444" }}>
          Good Day, Broker 👋
        </h2>
        <small style={{ color: "#999" }}>{today}</small>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <button
          onClick={() => setShowContacts(!showContacts)}
          style={{
            backgroundColor: "#0F4C5C",
            color: "#fff",
            padding: "6px 12px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          {showContacts ? "Hide CRM Contacts" : "Show CRM Contacts"}
        </button>
        <span style={{ fontSize: "20px", cursor: "pointer" }}>⚙️</span>
        <div
          style={{
            width: "35px",
            height: "35px",
            borderRadius: "50%",
            backgroundColor: "#f7c948",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          B
        </div>
      </div>

      {/* Conditionally Render ContactList */}
      {showContacts && (
        <div style={{ width: "100%", marginTop: "20px" }}>
          <ContactList />
        </div>
      )}
    </header>
  );
}
