import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './Login';
import Dashbord from './Dashboard';
import CreationDevis from './CreationDevis'
import GestionClients from './GestionClients';
import GestionCommandes from './GestionCommandes';
import GestionStock from './GestionStock'
import GestionFactures from './GestionFacture';
import GestionDepenses from './GestionDepenses';
import ForgotPassword from './ForgotPassword'


function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      
      <Routes>
        {/* ===== AUTHENTIFICATION ===== */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ===== COMMENTAIRE 10: DASHBOARD - pas besoin de produits =====
            Le dashboard n'a pas besoin de modifier les produits
        */}
        <Route path="/dashboard" element={<Dashbord />} />
       

        {/* ===== AUTRES PAGES - pas besoin de produits =====
            Ces pages gèrent d'autres données (devis, clients, commandes, etc.)
        */}
        <Route path="/gestion-devis" element={<CreationDevis />} />
        <Route path="/gestion-clients" element={<GestionClients />} />
        <Route path="/gestion-commandes" element={<GestionCommandes />} />
        <Route path="/gestion-de-stock" element={<GestionStock />} />
        <Route path="/gestion-de-facture" element={<GestionFactures />} />
        <Route path="/gestion-depenses" element={<GestionDepenses />} />
      
      </Routes>
    </BrowserRouter>
  );
}

export default App;