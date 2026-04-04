import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './Login';
import Dashbord from './Dashboard';
import CreationDevis from './CreationDevis';
import GestionClients from './GestionClients';
import GestionCommandes from './GestionCommandes';
import GestionStock from './GestionStock';
import GestionFactures from './GestionFacture';
import GestionDepenses from './GestionDepenses';
import GestionActivites from './GestionActivites';
import ForgotPassword from './ForgotPassword';
import AdminRoute from './components/auth/AdminRoute';
import { useAuthStore } from './lib/store/authStore';

function App() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* <Route path="/dashboard" element={<Dashbord />} /> */}
        <Route path="/gestion-devis" element={<CreationDevis />} />
        <Route path="/gestion-clients" element={<GestionClients />} />
        <Route path="/gestion-commandes" element={<GestionCommandes />} />
        {/* <Route path="/gestion-de-stock" element={<GestionStock />} /> */}
        <Route path="/gestion-de-facture" element={<GestionFactures />} />
        {/* <Route path="/gestion-depenses" element={<GestionDepenses />} /> */}
        <Route
          path="/activites"
          element={
            <AdminRoute>
              <GestionActivites />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
