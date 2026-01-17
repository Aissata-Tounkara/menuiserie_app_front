// components/tables/DataTable.jsx

import React, { useState } from 'react';
import { Eye, Edit2, Trash2, Download, Send, Calendar, Phone, Mail, MapPin, Package } from 'lucide-react';
import PaginationTable from './PaginationTable'; // Assure-toi que ce composant existe

const DataTable = ({ columns, data, actions = [], itemsPerPage = 5 }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

  // Gestionnaire de couleurs pour les badges (Statuts)
  const getStatusStyle = (status) => {
    const styles = {
      // Statuts Commandes / Production
      'En production': 'bg-purple-100 text-purple-700',
      'Payée': 'bg-green-100 text-green-700',
      'Livré': 'bg-blue-100 text-blue-700',
      'Prête': 'bg-orange-100 text-orange-700',
      'Annulée': 'bg-red-100 text-red-700',
      // Statuts Stock
      'Bon': 'bg-green-100 text-green-700',
      'Alerte': 'bg-red-100 text-red-700',
      // Types Clients
      'Particulier': 'bg-orange-100 text-orange-700',
      'Entreprise': 'bg-blue-100 text-blue-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const renderCell = (item, col) => {
    const value = item[col.key];

    if (col.render) return col.render(value, item);

    switch (col.type) {
      case 'badge':
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(value)}`}>
            {col.icon && <span className="inline-block mr-1">{col.icon}</span>}
            {value}
          </span>
        );
      
      case 'amount':
        return (
          <div className="flex flex-col">
            <span className="font-bold text-gray-900">{value} {item.currency || 'DA'}</span>
            {item.ht && <span className="text-[10px] text-gray-500 uppercase">HT: {item.ht} {item.currency || 'DA'}</span>}
          </div>
        );

      case 'client':
        return (
          <div className="flex flex-col">
            <span className="font-semibold text-gray-800">{value}</span>
            {item.phone && <span className="text-xs text-gray-500">{item.phone}</span>}
          </div>
        );

      case 'date':
        return (
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <span>{value}</span>
          </div>
        );

      default:
        return <span className="text-sm text-gray-700">{value}</span>;
    }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              {columns.map((col, index) => (
                <th key={index} className="px-6 py-4 text-[13px] font-semibold text-gray-500 uppercase tracking-wider">
                  {col.label || col.header} {/* Supporte les deux clés */}
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-6 py-4 text-right text-[13px] font-semibold text-gray-500 uppercase">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentData.map((item, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50/30 transition-colors">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 align-middle">
                    {renderCell(item, col)}
                  </td>
                ))}
                {actions.length > 0 && (
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {actions.map((action, i) => (
                        <button
                          key={i}
                          onClick={() => action.onClick(item)}
                          className={`p-2 rounded-lg transition-colors ${action.className || 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                          {action.icon}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination uniquement si nécessaire */}
      {totalPages > 1 && (
        <PaginationTable 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
};

export default DataTable;