import Header from "@/shared/components/Header";
import Footer from "@/shared/components/Footer";

export default function DefaultLayout({ children }) {
  return (
    <div className="app-container">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
