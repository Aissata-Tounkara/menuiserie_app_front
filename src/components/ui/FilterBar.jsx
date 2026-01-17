import React, { useState } from 'react';
import { Filter } from 'lucide-react';

const FilterBar = ({ 
  filters = [], 
  onFilterChange, 
  showSearch = false, 
  searchPlaceholder = "Filtrer...",
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Gestionnaire de changement de filtre
  const handleFilterClick = (filterValue) => {
    onFilterChange(filterValue);
  };

  // Si on a une recherche, on filtre les options affichées
  const displayedFilters = showSearch 
    ? filters.filter(f => f.label.toLowerCase().includes(searchTerm.toLowerCase()))
    : filters;

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 ${className}`}>
      {/* Barre de recherche */}
      {showSearch && (
        <div className="mb-3 relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {/* Boutons de filtre */}
      <div className="flex flex-wrap gap-2">
        {displayedFilters.map((filter, index) => (
          <button
            key={index}
            onClick={() => handleFilterClick(filter.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter.value === 'all'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {filter.label} {filter.count !== undefined && `(${filter.count})`}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;