# Modifications Récentes

## Bouton de Déconnexion - 17 avril 2026

### Fichier modifié

- **src/components/layout/Header.jsx**

### Modifications apportées

#### 1. **Imports ajoutés**

```javascript
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
```

#### 2. **Hook de navigation et fonction de déconnexion**

- Ajout du hook `useNavigate()` pour la redirection après déconnexion
- Ajout de la fonction `logout` depuis le store d'authentification
- Création de la fonction `handleLogout()` qui :
  - Appelle `authService.logout()` via le store
  - Redirige vers `/login` après la déconnexion
  - Gère les erreurs en cas de problème

#### 3. **Bouton de déconnexion**

- Ajout d'un bouton "Déconnexion" dans la navbar (côté droit)
- Icône : `<LogOut>` de lucide-react
- Style : Border rouge (`border-red-300`, `text-red-700`, `hover:bg-red-50`)
- Responsive :
  - Sur desktop : Affiche le texte "Déconnexion"
  - Sur mobile : Affiche uniquement l'icône

### Impact

✓ Tous les utilisateurs (admin et employés) peuvent maintenant se déconnecter depuis n'importe quelle page
✓ La fonction `logout()` existante dans `authStore.js` et `auth.service.js` est maintenant utilisée
✓ Le token et les données utilisateur sont supprimés de localStorage lors de la déconnexion

### Routes utilisées

- Déconnexion endpoint : `POST /auth/logout`
- Redirection post-logout : `/login`
