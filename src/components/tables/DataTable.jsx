import React, { useState } from 'react';
import { Phone, Mail, MapPin, Eye, Edit2, Trash2 } from 'lucide-react';
import Pagination from './Pagination'; // Assurez-vous que le chemin est correct

const DataTable = ({ columns, data, onView, onEdit, onDelete, itemsPerPage = 5 }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // --- Logique de calcul ---
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

  const getBadgeColor = (status) => {
    const colors = {
      'Actif': 'bg-green-100 text-green-700',
      'Inactif': 'bg-gray-100 text-gray-700',
      'En attente': 'bg-yellow-100 text-yellow-700',
      'Particulier': 'bg-orange-100 text-orange-700',
      'Entreprise': 'bg-blue-100 text-blue-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const renderCellContent = (column, row) => {
    const value = row[column.key];

    if (column.render) return column.render(value, row);

    switch (column.type) {
      case 'avatar':
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              {value.initials}
            </div>
            <div>
              <div className="font-medium text-gray-800">{value.name}</div>
              <div className="text-sm text-gray-500">{value.subtitle}</div>
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="w-4 h-4" />
              <span>{value.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="w-4 h-4" />
              <span>{value.email}</span>
            </div>
          </div>
        );
      case 'location':
        return (
          <div className="flex items-start gap-2 text-sm text-gray-600 text-wrap max-w-xs">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{value}</span>
          </div>
        );
      case 'badge':
        return (
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getBadgeColor(value)}`}>
            {value}
          </span>
        );
      case 'currency':
        return (
          <div>
            <div className="font-semibold text-gray-800">{value.amount}</div>
            <div className="text-xs text-gray-500">{value.details}</div>
          </div>
        );
      case 'number':
        return <span className="font-semibold text-gray-800">{value}</span>;
      default:
        return <span className="text-gray-700">{value}</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
              {(onView || onEdit || onDelete) && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.length > 0 ? (
              currentData.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50/50 transition-colors">
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                      {renderCellContent(column, row)}
                    </td>
                  ))}
                  {(onView || onEdit || onDelete) && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        {onView && (
                          <button onClick={() => onView(row)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        {onEdit && (
                          <button onClick={() => onEdit(row)} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg">
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        {onDelete && (
                          <button onClick={() => onDelete(row)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-10 text-center text-gray-500">
                  Aucune donnée disponible
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Utilisation du composant Pagination */}
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default DataTable;