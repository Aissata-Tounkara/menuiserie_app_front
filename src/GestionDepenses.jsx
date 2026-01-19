import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Trash2, Edit2, Download, FileText, Calendar, DollarSign, X, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';

// Store
import { useDepensesStore } from './lib/store/depensesStore';

export default function GestionDepenses() {
  // Store hooks
  const {
    depenses,
    depensesLoading,
    depensesError,
    depensesPagination,
    depensesStats,
    fetchDépenses,
    fetchDépensesStats,
    createDépense,
    updateDépense,
    deleteDépense,
    searchDépenses,
  } = useDepensesStore();

  // Local state
  const [query, setQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filterMonth, setFilterMonth] = useState('all');
  const [showLinks, setShowLinks] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const categories = ['Achat matériaux', 'Transport', 'Électricité', 'Maintenance', 'Autre'];

  const [form, setForm] = useState({ 
    categorie: categories[0], 
    description: '', 
    montant: '', 
    date: new Date().toISOString().split('T')[0] 
  });

  // Charger les dépenses au montage
  useEffect(() => {
    fetchDépenses(1);
    fetchDépensesStats();
  }, [fetchDépenses, fetchDépensesStats]);

  // Gérer la recherche
  useEffect(() => {
    if (query.trim()) {
      searchDépenses(query);
    } else {
      fetchDépenses(1);
    }
  }, [query, searchDépenses, fetchDépenses]);

  const resetForm = () => setForm({ 
    categorie: categories[0], 
    description: '', 
    montant: '', 
    date: new Date().toISOString().split('T')[0] 
  });

  const handleAdd = async () => {
    if (!form.description.trim() || !form.montant) {
      return alert('Veuillez remplir la description et le montant');
    }

    setFormSubmitting(true);
    try {
      if (editing) {
        await updateDépense(editing, {
          categorie: form.categorie,
          description: form.description,
          montant: parseFloat(form.montant),
          date: form.date,
        });
        setEditing(null);
      } else {
        await createDépense({
          categorie: form.categorie,
          description: form.description,
          montant: parseFloat(form.montant),
          date: form.date,
        });
      }
      resetForm();
      setShowModal(false);
      await fetchDépenses(1);
      fetchDépensesStats();
    } catch (error) {
      alert(`Erreur: ${error.message}`);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setEditing(item.id);
    setForm({ 
      categorie: item.categorie, 
      description: item.description, 
      montant: item.montant, 
      date: item.date 
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer cette dépense ?')) {
      try {
        await deleteDépense(id);
        fetchDépensesStats();
      } catch (error) {
        alert(`Erreur: ${error.message}`);
      }
    }
  };

  const filtered = useMemo(() => {
    return depenses.filter(d => {
      const matchQuery = (d.description || '').toLowerCase().includes(query.toLowerCase()) || (d.categorie || '').toLowerCase().includes(query.toLowerCase());
      if (filterMonth === 'all') return matchQuery;
      const month = (d.date || '').slice(0,7); // YYYY-MM
      return matchQuery && month === filterMonth;
    });
  }, [depenses, query, filterMonth]);

  const totalMonth = useMemo(() => {
    if (filterMonth === 'all') return depenses.reduce((s, d) => s + (d.montant || 0), 0);
    return depenses.filter(d => (d.date || '').slice(0,7) === filterMonth).reduce((s, d) => s + (d.montant || 0), 0);
  }, [depenses, filterMonth]);

  const months = useMemo(() => {
    const set = new Set(depenses.map(d => (d.date || '').slice(0,7)).filter(Boolean));
    return ['all', ...Array.from(set).sort((a,b)=>b.localeCompare(a))];
  }, [depenses]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <button className="sm:hidden mb-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
            onClick={() => setShowLinks(!showLinks)}
          > 
            {showLinks ? "Fermer le menu" : "Afficher le menu"}
          </button>

          <div
            className={`${
              showLinks ? "grid grid-cols-2 gap-2" : "hidden"
            } sm:flex sm:items-center sm:justify-between sm:gap-2`}
          >
            <Link to="/dashboard" className="text-left py-2 px-2 text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200">Dashboard</Link>
            <Link to="/gestion-clients" className="text-left py-2 px-2 text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200">Gestion clients</Link>
            <Link to="/gestion-commandes" className="text-left py-2 px-2 text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200">Gestion des Commandes</Link>
            <Link to="/gestion-de-stock" className="text-left py-2 px-2 text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200">Gestion des stocks</Link>
            <Link to="/gestion-devis" className="text-left py-2 px-2 text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200">Gestion des devis</Link>
            <Link to="/gestion-de-facture" className="text-left py-2 px-2 text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200">Gestion des factures</Link>
          </div>

          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestion des Dépenses</h1>
              <p className="text-sm text-gray-500">Enregistrer et suivre les dépenses de l'atelier</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => { setShowModal(true); setEditing(null); resetForm(); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"><Plus className="w-4 h-4" />Nouvelle dépense</button>
              <button onClick={() => alert('Export CSV')} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 flex items-center gap-2"><Download className="w-4 h-4" />Export CSV</button>
              <button onClick={() => fetchDépenses(1)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700"><Loader className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Afficher l'erreur si elle existe */}
        {depensesError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-red-700">{depensesError}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
              <Search className="w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Rechercher description ou catégorie..." value={query} onChange={e=>setQuery(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
              <select value={filterMonth} onChange={e=>setFilterMonth(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg">
                {months.map(m => <option key={m} value={m}>{m === 'all' ? 'Tous les mois' : m}</option>)}
              </select>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4">
              <h2 className="text-lg font-bold mb-3">Liste des dépenses</h2>
              {depensesLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="flex items-center gap-2">
                    <Loader className="w-5 h-5 animate-spin text-blue-500" />
                    <p>Chargement des dépenses...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {filtered.length === 0 && <div className="text-sm text-gray-500">Aucune dépense trouvée.</div>}
                  {filtered.map(d => (
                    <div key={d.id} className="flex items-center justify-between border border-gray-100 rounded-lg p-3">
                      <div>
                        <div className="font-semibold text-gray-900">{d.categorie || '-'} • {d.description || '-'}</div>
                        <div className="text-xs text-gray-500">{d.date || '-'}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-lg font-bold text-gray-900">{parseFloat(d.montant || 0).toLocaleString()} DA</div>
                        <button onClick={()=>handleEdit(d)} className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Edit2 className="w-4 h-4"/></button>
                        <button onClick={()=>handleDelete(d.id)} className="p-2 bg-red-50 text-red-600 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold mb-3">Résumé</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm"><span>Total sélection:</span><span className="font-semibold">{totalMonth.toLocaleString()} DA</span></div>
                <div className="flex justify-between text-sm"><span>Nombre de lignes:</span><span className="font-semibold">{filtered.length}</span></div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Modal Formulaire */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl flex items-center justify-between">
              <h2 className="text-xl font-bold">{editing ? 'Modifier dépense' : 'Nouvelle dépense'}</h2>
              <button onClick={() => { setShowModal(false); resetForm(); setEditing(null); }} className="text-white hover:bg-blue-800 rounded-full p-1">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie *</label>
                <select value={form.categorie} onChange={e=>setForm({...form, categorie:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  {categories.map(c=> <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <input type="text" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Ex: Achat de profilés" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Montant (FCFA) *</label>
                  <input type="number" value={form.montant} onChange={e=>setForm({...form, montant:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                  <input type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={handleAdd} disabled={formSubmitting} className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                  {formSubmitting && <Loader className="w-4 h-4 animate-spin" />}
                  {editing ? 'Enregistrer' : 'Ajouter'}
                </button>
                <button onClick={() => { resetForm(); setShowModal(false); setEditing(null); }} className="flex-1 border border-gray-300 px-4 py-3 rounded-lg hover:bg-gray-50 font-semibold">
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
