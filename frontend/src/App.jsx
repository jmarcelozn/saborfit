import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import { useAuth } from "./context/useAuth";

import Header from "./components/Header";
import Footer from "./components/Footer";

function Layout({ children }) {
  return (
    <div className="app-container">
      <Header />
      {children}
      <Footer />
    </div>
  );
}

function RedirectIfAuthenticated({ children }) {
  const { isAuthenticated, isInitializing, user } = useAuth();

  if (isInitializing) {
    return null;
  }

  if (!isAuthenticated) {
    return children;
  }

  return <Navigate to={user?.role === 'admin' ? '/admin' : '/'} replace />;
}

function RequireAuth({ children }) {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return null;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function RequireAdmin({ children }) {
  const { isAuthenticated, isInitializing, user } = useAuth();

  if (isInitializing) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return user?.role === 'admin' ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* Home */}
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />

          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Layout>
                  <Profile />
                </Layout>
              </RequireAuth>
            }
          />

          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <Layout>
                  <Admin />
                </Layout>
              </RequireAdmin>
            }
          />

          {/* Autenticação */}
          <Route
            path="/login"
            element={
              <RedirectIfAuthenticated>
                <Login />
              </RedirectIfAuthenticated>
            }
          />

          <Route
            path="/register"
            element={
              <RedirectIfAuthenticated>
                <Register />
              </RedirectIfAuthenticated>
            }
          />

          <Route
            path="/forgot-password"
            element={
              <RedirectIfAuthenticated>
                <ForgotPassword />
              </RedirectIfAuthenticated>
            }
          />

          <Route
            path="/reset-password"
            element={
              <RedirectIfAuthenticated>
                <ResetPassword />
              </RedirectIfAuthenticated>
            }
          />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;