import React, { useMemo, useState } from 'react';
import Select from '../ui/Select';
import { useAuthStore } from '../../lib/store/authStore';

const Header = ({
  title,
  subtitle,
  navigationLinks = [],
  actions = [],
  selectAction = null,
  userAvatar,
  userName,
}) => {
  const [showLinks, setShowLinks] = useState(false);
  const { user } = useAuthStore();

  const resolvedNavigationLinks = useMemo(() => {
    const hasActivityLink = navigationLinks.some((link) => link.href === '/activites');

    if (user?.role === 'admin' && !hasActivityLink) {
      return [...navigationLinks, { label: 'Activités', href: '/activites' }];
    }

    return navigationLinks;
  }, [navigationLinks, user]);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-5 py-4">
        {resolvedNavigationLinks.length > 0 && (
          <button
            className="sm:hidden mb-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
            onClick={() => setShowLinks(!showLinks)}
          >
            {showLinks ? 'Fermer le menu' : 'Afficher le menu'}
          </button>
        )}

        {resolvedNavigationLinks.length > 0 && (
          <div
            className={`${
              showLinks ? 'grid grid-cols-2 gap-2' : 'hidden'
            } sm:flex sm:items-center sm:flex-justify-between sm:gap-2 mb-4`}
          >
            {resolvedNavigationLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-left py-2 px-14 text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200 "
              >
                {link.label}
              </a>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
            {selectAction && (
              <div className="w-full sm:w-48">
                <Select
                  value={selectAction.value}
                  onChange={selectAction.onChange}
                  options={selectAction.options}
                  placeholder={selectAction.placeholder}
                  disabled={selectAction.disabled}
                  label={null}
                  className="mb-0"
                />
              </div>
            )}

            {userAvatar && userName && (
              <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
                <span className="text-gray-700 font-medium hidden sm:inline">{userName}</span>
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {userAvatar}
                </div>
              </div>
            )}

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

export default Header;
