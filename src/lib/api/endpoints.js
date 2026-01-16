export const ENDPOINTS = {
  // ======================
  // AUTH (publique + admin)
  // ======================
  AUTH: {
    LOGIN: '/auth/login',                     // POST (publique)
    FORGOT_PASSWORD: '/auth/forgot-password', // POST (publique)
    RESET_PASSWORD: '/auth/reset-password',   // POST (publique)

    LOGOUT: '/auth/logout',                   // POST (admin – sanctum)
    ME: '/auth/me',                           // GET (admin – sanctum)
  },

  // ======================
  // DASHBOARD (admin uniquement)
  // ======================
  DASHBOARD: {
    STATS: '/dashboard',                      // GET
    CHART_DATA: '/dashboard/chart-data',      // GET
  },

  // ======================
  // DEVIS (admin uniquement)
  // ======================
  QUOTES: {
    LIST: '/devis',                           // GET
    CREATE: '/devis',                         // POST
    DETAIL: (id) => `/devis/${id}`,           // GET
    UPDATE: (id) => `/devis/${id}`,           // PUT
    DELETE: (id) => `/devis/${id}`,           // DELETE
    VALIDATE_AND_INVOICE: (id) => `/devis/${id}/valider`, // POST
  },

  // ======================
  // COMMANDES (admin uniquement)
  // ======================
  ORDERS: {
    LIST: '/commandes',                       // GET
    CREATE: '/commandes',                     // POST
    DETAIL: (id) => `/commandes/${id}`,       // GET
    UPDATE: (id) => `/commandes/${id}`,       // PUT
    DELETE: (id) => `/commandes/${id}`,       // DELETE
    UPDATE_STATUS: (id) => `/commandes/${id}/statut`, // POST
    STATS: '/commandes/stats',                // GET
  },

  // ======================
  // FACTURES (admin uniquement)
  // ======================
  INVOICES: {
    LIST: '/factures',                        // GET
    CREATE: '/factures',                      // POST
    DETAIL: (id) => `/factures/${id}`,        // GET
    UPDATE: (id) => `/factures/${id}`,        // PUT
    DELETE: (id) => `/factures/${id}`,        // DELETE
    MARK_AS_PAID: (id) => `/factures/${id}/payer`, // POST
    STATS: '/factures/stats',                 // GET
  },

  // ======================
  // CLIENTS (admin uniquement)
  // ======================
  CUSTOMERS: {
    LIST: '/clients',                         // GET
    CREATE: '/clients',                       // POST
    DETAIL: (id) => `/clients/${id}`,         // GET
    UPDATE: (id) => `/clients/${id}`,         // PUT
    DELETE: (id) => `/clients/${id}`,         // DELETE
    UPDATE_STATUS: (id) => `/clients/${id}/statut`, // PATCH
    STATS: '/clients/stats',                  // GET
  },

  // ======================
  // DÉPENSES (admin uniquement)
  // ======================
  EXPENSES: {
    LIST: '/depenses',                        // GET
    CREATE: '/depenses',                      // POST
    DETAIL: (id) => `/depenses/${id}`,        // GET
    UPDATE: (id) => `/depenses/${id}`,        // PUT
    DELETE: (id) => `/depenses/${id}`,        // DELETE
    STATS: '/depenses/stats',                 // GET
  },

  // ======================
  // ARTICLES (admin uniquement)
  // ======================
  PRODUCTS: {
    LIST: '/articles',                        // GET
    CREATE: '/articles',                      // POST
    DETAIL: (id) => `/articles/${id}`,        // GET
    UPDATE: (id) => `/articles/${id}`,        // PUT
    DELETE: (id) => `/articles/${id}`,        // DELETE
    ADJUST_STOCK: (id) => `/articles/${id}/ajuster-stock`, // POST
    ALERTS: '/articles/alertes',              // GET
    STATS: '/articles/stats',                 // GET
  },

  // ======================
  // MOUVEMENTS DE STOCK (admin uniquement)
  // ======================
  STOCK_MOVEMENTS: {
    LIST: '/mouvement',                       // GET
    CREATE: '/mouvement',                     // POST
    DETAIL: (id) => `/mouvement/${id}`,       // GET
    DELETE: (id) => `/mouvement/${id}`,       // DELETE
    STATS: '/mouvement/stats',                // GET
    HISTORY_BY_PRODUCT: (articleId) => `/articles/${articleId}/historique-mouvement`, // GET
  },
};