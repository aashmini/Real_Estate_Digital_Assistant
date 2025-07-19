import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const initialMetrics = [
  { label: "Total Properties", value: 12 },
  { label: "Active Clients", value: 18 },
  { label: "Scheduled Meetings", value: 9 },
  { label: "Avg Deal Size", value: 15 }, // ₹15 Lakhs
];

const chartData = [
  { month: "Jan", deals: 2 },
  { month: "Feb", deals: 4 },
  { month: "Mar", deals: 6 },
  { month: "Apr", deals: 3 },
  { month: "May", deals: 7 },
  { month: "Jun", deals: 9 },
];

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState(initialMetrics.map((m) => ({ ...m, display: 0 })));

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((m, i) => {
          if (m.display < m.value) {
            return { ...m, display: Math.min(m.display + 1, m.value) };
          }
          return m;
        })
      );
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <MainLayout>
      <div className="p-10 bg-[#FDF6EC] min-h-screen font-['Poppins']">
        <h1 className="text-3xl font-bold text-[#0F4C5C] font-['Playfair Display'] mb-8">
          📊 Analytics Dashboard
        </h1>

        {/* Animated Metric Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-white p-6 border-t-4 border-[#E0B973] rounded-lg shadow-md text-center hover:shadow-lg transition"
            >
              <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
              <p className="text-3xl font-extrabold text-[#0F4C5C] tracking-wide">
                {metric.label === "Avg Deal Size" ? `₹${metric.display}L+` : metric.display}
              </p>
            </div>
          ))}
        </div>

        {/* Line Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md border-2 border-[#E0B973]">
          <h2 className="text-xl font-semibold text-[#0F4C5C] font-['Playfair Display'] mb-4">
            📈 Monthly Deal Trends
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="deals" stroke="#0F4C5C" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </MainLayout>
  );
}
