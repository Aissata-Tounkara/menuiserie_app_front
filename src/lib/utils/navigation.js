export const getNavigationLinks = (user) => {
  const links = [
    { label: 'Gestion clients', href: '/gestion-clients' },
    { label: 'Gestion des Commandes', href: '/gestion-commandes' },
    { label: 'Gestion des devis', href: '/gestion-devis' },
    { label: 'Gestion des dépenses', href: '/gestion-depenses' },
    { label: 'Gestion des stocks', href: '/gestion-de-stock' },
    { label: 'Gestion des factures', href: '/gestion-de-facture' },
  ];

  if (user?.role === 'admin') {
    links.push({ label: 'Activités', href: '/activites' });
  }

  return links;
};
