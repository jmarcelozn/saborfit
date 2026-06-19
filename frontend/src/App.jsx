import { AuthProvider } from "@/app/providers/AuthProvider";
import { NotificationProvider } from "@/app/contexts/NotificationContext";
import AppRoutes from "@/app/routes/AppRoutes";

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;
