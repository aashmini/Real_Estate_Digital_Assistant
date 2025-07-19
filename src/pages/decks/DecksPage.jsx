import React, { useState } from "react";
import MainLayout from "../../layouts/MainLayout";

export default function DecksPage() {
  const decks = [
    {
      id: 1,
      title: "Hitech City Investment Deck",
      property: "Premium Office Space",
      created: "2025-07-05",
      summary: "Auto-generated pitch deck summarizing financials, amenities, and locality advantages.",
      file: "/files/hitech-city-deck.pdf", // Must be in /public/files/
    },
    {
      id: 2,
      title: "Retail Hub Proposal",
      property: "Luxury Retail Space",
      created: "2025-07-06",
      summary: "Visual one-pager with ROI, nearby attractions, and audience segmentation.",
      file: "/files/retail-hub-proposal.pdf",
    },
  ];

  const [selectedDeck, setSelectedDeck] = useState(null);

  const handleDownload = (filePath) => {
    const link = document.createElement("a");
    link.href = filePath;
    link.download = filePath.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenModal = (deck) => {
    setSelectedDeck(deck);
    document.body.style.overflow = "hidden";
  };

  const handleCloseModal = () => {
    setSelectedDeck(null);
    document.body.style.overflow = "auto";
  };

  return (
    <MainLayout>
      <div className="p-6 md:p-10 bg-[#fffbea] min-h-screen font-['Poppins'] text-[#0F4C5C]">
        <h1 className="text-3xl font-bold font-['Playfair Display'] mb-8">
          📑 Investment Decks & One-Pagers
        </h1>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck) => (
            <div
              key={deck.id}
              className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between border border-gray-200"
            >
              <div>
                <h3 className="text-xl font-semibold text-[#0F4C5C] font-['Playfair Display'] mb-2">
                  {deck.title}
                </h3>
                <p className="text-gray-600 mb-1"><strong>🏢 Property:</strong> {deck.property}</p>
                <p className="text-gray-600 mb-1"><strong>🗓 Created:</strong> {deck.created}</p>
                <p className="text-[#444] mt-2 text-sm">{deck.summary}</p>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-[#E0B973] text-white rounded hover:bg-[#d4a95f] text-sm flex items-center gap-1"
                  onClick={() => handleOpenModal(deck)}
                >
                  🔍 Preview
                </button>
                <button
                  className="px-4 py-2 bg-white text-[#0F4C5C] border border-[#0F4C5C] rounded hover:bg-[#f0f0f0] text-sm flex items-center gap-1"
                  onClick={() => handleDownload(deck.file)}
                >
                  📥 Download
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for PDF Preview */}
        {selectedDeck && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center px-4 py-8">
            <div className="relative w-full max-w-4xl bg-white rounded-xl overflow-hidden shadow-xl max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="flex justify-between items-center px-5 py-3 bg-[#FDF6EC] border-b border-[#eee]">
                <h2 className="text-lg font-bold text-[#0F4C5C] font-['Playfair Display']">
                  📄 {selectedDeck.title}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-2xl text-gray-500 hover:text-red-500 font-bold"
                >
                  &times;
                </button>
              </div>

              {/* PDF Iframe */}
              <div className="overflow-y-auto p-2 bg-white" style={{ height: "80vh" }}>
                <iframe
                  src={selectedDeck.file}
                  title="PDF Preview"
                  className="w-full h-full min-h-[75vh] rounded"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}