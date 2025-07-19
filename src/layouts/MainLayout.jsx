import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function MainLayout({ children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#fffbe6" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header />
        <main style={{ padding: "30px", flex: 1 }}>{children}</main>
      </div>
    </div>
  );
}
