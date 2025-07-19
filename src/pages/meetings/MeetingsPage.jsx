import React, { useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import dayjs from "dayjs";

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState([
    { id: 1, title: "Site Visit", client: "Ananya Sharma", date: "2025-07-10", time: "11:00", status: "Upcoming" },
    { id: 2, title: "Investment Pitch", client: "Raj Mehta", date: "2025-07-11", time: "14:00", status: "Upcoming" },
    { id: 3, title: "Property Review", client: "Kiran Rao", date: "2025-07-09", time: "16:30", status: "Completed" },
  ]);

  const [formData, setFormData] = useState({ title: "", client: "", date: "", time: "", status: "Upcoming" });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.client || !formData.date || !formData.time) {
      alert("Please fill all fields");
      return;
    }

    if (editingId) {
      setMeetings(meetings.map((m) => (m.id === editingId ? { ...formData, id: editingId } : m)));
    } else {
      setMeetings([...meetings, { ...formData, id: Date.now() }]);
    }

    setFormData({ title: "", client: "", date: "", time: "", status: "Upcoming" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (meeting) => {
    setFormData(meeting);
    setEditingId(meeting.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure to delete this meeting?")) {
      setMeetings(meetings.filter((m) => m.id !== id));
    }
  };

  const filteredMeetings = meetings.filter((m) => {
    const matchSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.client.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || m.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const badgeClass = (status) => {
    if (status === "Upcoming") return "bg-yellow-100 text-yellow-800";
    if (status === "Completed") return "bg-green-100 text-green-700";
    return "bg-red-100 text-red-600";
  };

  return (
    <MainLayout>
      <div className="p-6 min-h-screen bg-[#fef9f4] font-['Poppins']">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#0F4C5C] font-['Playfair_Display']">📅 Meetings</h1>
            <p className="text-sm text-gray-500">Track and manage your meetings with clients easily.</p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setFormData({ title: "", client: "", date: "", time: "", status: "Upcoming" });
              setEditingId(null);
            }}
            className="bg-[#E0B973] hover:bg-[#d4a95f] text-white px-4 py-2 rounded-lg text-sm font-semibold"
          >
            {showForm ? "Cancel" : "➕ Schedule Meeting"}
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by title or client"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border border-[#E0B973] rounded-lg shadow-sm text-sm w-full sm:w-auto"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border border-[#E0B973] rounded-lg shadow-sm text-sm w-full sm:w-auto"
          >
            <option value="All">All</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Meeting Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Meeting Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Client Name"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                className="p-2 border border-gray-300 rounded"
              />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="p-2 border border-gray-300 rounded"
              />
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="p-2 border border-gray-300 rounded"
              />
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="p-2 border border-gray-300 rounded"
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="text-right">
              <button
                type="submit"
                className="bg-[#0F4C5C] text-white px-4 py-2 rounded hover:bg-[#0c3c48] transition"
              >
                {editingId ? "Update Meeting" : "Add Meeting"}
              </button>
            </div>
          </form>
        )}

        {/* Meeting Cards */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMeetings.map((meeting) => (
            <div
              key={meeting.id}
              className="bg-white p-5 rounded-lg shadow border border-gray-100 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-semibold text-[#0F4C5C] mb-1">{meeting.title}</h3>
                <p className="text-sm text-gray-500 mb-2">👤 {meeting.client}</p>
                <p className="text-sm text-gray-700 mb-1">🗓 {meeting.date} at ⏰ {meeting.time}</p>
                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${badgeClass(meeting.status)}`}>
                  {meeting.status}
                </span>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => handleEdit(meeting)}
                  className="text-sm px-3 py-1 rounded bg-[#E0B973] text-white hover:bg-[#d4a95f]"
                >
                  ✏ Edit
                </button>
                <button
                  onClick={() => handleDelete(meeting.id)}
                  className="text-sm px-3 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
