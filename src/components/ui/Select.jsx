import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

// Composant Select réutilisable
const Select = ({ 
  label, 
  value, 
  onChange, 
  options = [], 
  placeholder = "Sélectionner...",
  disabled = false,
  required = false,
  error = "",
  helperText = "",
  className = ""
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`
            w-full px-3 py-2 pr-10 border rounded-lg appearance-none
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${disabled ? 'text-gray-500' : 'text-gray-900'}
            transition-colors
          `}
        >
          <option value="">{placeholder}</option>
          {options.map((option, index) => (
            <option 
              key={index} 
              value={typeof option === 'string' ? option : option.value}
            >
              {typeof option === 'string' ? option : option.label}
            </option>
          ))}
        </select>
        
        <ChevronDown className={`
          absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5
          pointer-events-none
          ${disabled ? 'text-gray-400' : 'text-gray-500'}
        `} />
      </div>

      {helperText && !error && (
        <p className="text-xs text-gray-500 mt-1">{helperText}</p>
      )}
      
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};

export default Select;