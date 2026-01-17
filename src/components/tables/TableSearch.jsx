
import { Search } from 'lucide-react';

const TableSearch = ({ 
  value, 
  onChange, 
  placeholder = "Rechercher...", 
  className = "" 
}) => {
  return (
    <div className={`relative w-full max-w-md ${className}`}>
      {/* Icône de recherche positionnée de manière absolue */}
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      
      {/* L'input proprement dit */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg 
                   leading-5 bg-white placeholder-gray-500 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                   sm:text-sm transition-all"
        placeholder={placeholder}
      />
    </div>
  );
};

export default TableSearch;