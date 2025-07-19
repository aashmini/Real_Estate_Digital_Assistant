import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ContactList({ onEdit, onDelete }) {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/contacts") // Make sure this matches your backend
      .then((res) => setContacts(res.data.results || []))
      .catch((err) => console.error("Failed to fetch contacts:", err));
  }, []);

  return (
    <div style={{ marginTop: "15px" }}>
      <h3 style={{ fontSize: "18px", marginBottom: "10px" }}>🔗 CRM Contacts:</h3>
      {contacts.length === 0 ? (
        <p>No contacts found.</p>
      ) : (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {contacts.map((contact) => (
            <li
              key={contact.id}
              style={{
                background: "#f2f2f2",
                padding: "10px",
                marginBottom: "6px",
                borderRadius: "5px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div>
                <strong>{contact.properties.firstname || "Unnamed"}</strong>{" "}
                {contact.properties.lastname}
                <br />
                📧 {contact.properties.email || "No email"}
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  style={{
                    backgroundColor: "#E0B973",
                    color: "#0F4C5C",
                    border: "none",
                    padding: "6px 10px",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}
                  onClick={() => onEdit(contact)}
                >
                  ✏️
                </button>
                <button
                  style={{
                    backgroundColor: "#FFCCCC",
                    color: "#B00020",
                    border: "none",
                    padding: "6px 10px",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}
                  onClick={() => onDelete(contact.id)}
                >
                  🗑️
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
