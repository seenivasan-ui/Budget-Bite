import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home        from './pages/Home';
import Search      from './pages/Search';
import FoodDetail  from './pages/FoodDetail';
import BudgetPlanner from './pages/BudgetPlanner';
import Login       from './pages/Login';
import Register    from './pages/Register';
import Profile     from './pages/Profile';
import Wishlist    from './pages/Wishlist';
import AdminDashboard from './pages/AdminDashboard';
import AdminFoods  from './pages/AdminFoods';
import AdminUsers  from './pages/AdminUsers';
import NotFound    from './pages/NotFound';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  return user ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Router>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 64px)' }}>
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/search"    element={<Search />} />
          <Route path="/food/:slug" element={<FoodDetail />} />
          <Route path="/budget"    element={<BudgetPlanner />} />
          <Route path="/login"     element={<Login />} />
          <Route path="/register"  element={<Register />} />
          <Route path="/profile"   element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/wishlist"  element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path="/admin"           element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/foods"     element={<AdminRoute><AdminFoods /></AdminRoute>} />
          <Route path="/admin/users"     element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="*"          element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#0d1a12', color: '#e8f0eb', border: '1px solid #1a2e20', fontFamily: 'Sora, sans-serif' },
          success: { iconTheme: { primary: '#00ff88', secondary: '#000' } },
          error:   { iconTheme: { primary: '#ff4444', secondary: '#fff' } },
        }}
      />
      <AppRoutes />
    </AuthProvider>
  );
}
