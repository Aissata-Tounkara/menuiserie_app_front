import React, { useEffect, useState } from 'react';
import { Activity, RefreshCw, AlertCircle } from 'lucide-react';
import Header from './components/layout/Header';
import DataTable from './components/tables/DataTable';
import { apiClient } from './lib/api/client';
import { ENDPOINTS } from './lib/api/endpoints';

export default function GestionActivites() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiClient.get(ENDPOINTS.ADMIN.ACTIVITIES);
      const payload = response?.data ?? response;
      setActivities(Array.isArray(payload) ? payload : payload?.data ?? []);
    } catch (err) {
      setError(err.message || 'Impossible de charger les activités');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const columns = [
    {
      header: 'Date',
      key: 'logged_at',
      render: (value) => (value ? new Date(value).toLocaleString('fr-FR') : '-'),
    },
    {
      header: 'Utilisateur',
      key: 'user_email',
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{row?.user?.name || 'Utilisateur inconnu'}</div>
          <div className="text-xs text-gray-500">{row?.user?.email || value || '-'}</div>
        </div>
      ),
    },
    {
      header: 'Appareil',
      key: 'device_name',
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value || 'Appareil inconnu'}</div>
          <div className="text-xs text-gray-500">{row?.device_type || row?.user_agent || '-'}</div>
        </div>
      ),
    },
    {
      header: 'Action',
      key: 'action',
      render: (value) => <span className="font-medium text-gray-900">{value || '-'}</span>,
    },
    {
      header: 'Module',
      key: 'module',
      render: (value) => value || '-',
    },
    {
      header: 'Description',
      key: 'description',
      render: (value) => value || '-',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Journal des activités"
        subtitle={loading ? 'Chargement...' : `${activities.length} activité(s) enregistrée(s)`}
        navigationLinks={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Gestion clients', href: '/gestion-clients' },
          { label: 'Gestion des Commandes', href: '/gestion-commandes' },
          { label: 'Gestion des devis', href: '/gestion-devis' },
          { label: 'Gestion des factures', href: '/gestion-de-facture' },
        ]}
        actions={[
          {
            label: 'Rafraîchir',
            icon: <RefreshCw className="w-4 h-4" />,
            onClick: fetchActivities,
            variant: 'secondary',
          },
        ]}
      />

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <div>
              <p className="text-red-700 font-medium">Erreur</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="flex items-center gap-2 text-gray-600">
                <Activity className="w-5 h-5 animate-pulse text-blue-500" />
                <span>Chargement des activités...</span>
              </div>
            </div>
          ) : (
            <DataTable columns={columns} data={activities} itemsPerPage={10} />
          )}
        </div>
      </main>
    </div>
  );
}
