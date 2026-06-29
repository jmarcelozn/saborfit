import { AuthProvider } from "@/app/providers/AuthProvider";
import { CartProvider } from "@/app/providers/CartProvider";
import { NotificationProvider } from "@/app/contexts/NotificationContext";
import AppRoutes from "@/app/routes/AppRoutes";

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;
