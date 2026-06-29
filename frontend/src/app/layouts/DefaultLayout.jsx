import Header from "@/shared/components/Header";
import Footer from "@/shared/components/Footer";
import { useStoreSettings } from "@/features/settings/hooks/useStoreSettings";

export default function DefaultLayout({ children }) {
  const { settings, hasVisibleSettings } = useStoreSettings();

  return (
    <div className="app-container">
      <Header />
      {children}
      <Footer settings={hasVisibleSettings ? settings : null} />
    </div>
  );
}
