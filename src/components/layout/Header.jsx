import React, { useState } from 'react';
import { X, Save, Plus, Filter, Download, ChevronDown } from 'lucide-react';

// Composant Header réutilisable
const PageHeader = ({ 
  title, 
  subtitle, 
  navigationLinks = [],
  actions = [],
  showPeriodSelector = false,
  periodValue = "Ce mois",
  onPeriodChange,
  userAvatar,
  userName
}) => {
  const [showLinks, setShowLinks] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-5 py-4">
        
        {/* Menu mobile toggle */}
        {navigationLinks.length > 0 && (
          <button 
            className="sm:hidden mb-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
            onClick={() => setShowLinks(!showLinks)}
          > 
            {showLinks ? "Fermer le menu" : "Afficher le menu"}
          </button>
        )}

        {/* Navigation Links */}
        {navigationLinks.length > 0 && (
          <div
            className={`${
              showLinks ? "grid grid-cols-2 gap-2" : "hidden"
            } sm:flex sm:items-center sm:flex-wrap sm:gap-2 mb-4`}
          >
            {navigationLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-left py-2 px-2 text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}

        {/* Header content */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Period Selector */}
            {showPeriodSelector && (
              <select
                value={periodValue}
                onChange={(e) => onPeriodChange && onPeriodChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
              >
                <option value="Ce mois">Ce mois</option>
                <option value="Ce trimestre">Ce trimestre</option>
                <option value="Cette année">Cette année</option>
                <option value="Personnalisé">Personnalisé</option>
              </select>
            )}

            {/* User Avatar */}
            {userAvatar && userName && (
              <>
                <span className="text-gray-700 font-medium hidden sm:inline">{userName}</span>
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {userAvatar}
                </div>
              </>
            )}

            {/* Action Buttons */}
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                disabled={action.disabled}
                className={`px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-base rounded-lg flex items-center gap-2 transition-colors ${
                  action.variant === 'primary'
                    ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {action.icon}
                <span className="hidden sm:inline">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};