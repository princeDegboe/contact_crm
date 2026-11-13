import { Routes } from '@angular/router';

// Chargement différé (lazy) : le code d'une page n'est téléchargé que quand on la visite
export const routes: Routes = [
  {
    path: '',
    title: 'Dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'contacts',
    title: 'Contacts',
    loadComponent: () =>
      import('./features/contacts/contact-list/contact-list').then((m) => m.ContactList),
  },
  // "new" doit rester AVANT ":id", sinon "new" serait pris pour un id
  {
    path: 'contacts/new',
    title: 'Nouveau contact',
    loadComponent: () =>
      import('./features/contacts/contact-form/contact-form').then((m) => m.ContactForm),
  },
  {
    path: 'contacts/:id',
    title: 'Détail du contact',
    loadComponent: () =>
      import('./features/contacts/contact-detail/contact-detail').then((m) => m.ContactDetail),
  },
  // Même composant pour créer et modifier
  {
    path: 'contacts/:id/edit',
    title: 'Modifier le contact',
    loadComponent: () =>
      import('./features/contacts/contact-form/contact-form').then((m) => m.ContactForm),
  },
  {
    path: 'categories',
    title: 'Catégories',
    loadComponent: () =>
      import('./features/categories/category-list/category-list').then((m) => m.CategoryList),
  },
  {
    path: 'categories/new',
    title: 'Nouvelle catégorie',
    loadComponent: () =>
      import('./features/categories/category-form/category-form').then((m) => m.CategoryForm),
  },
  {
    path: 'categories/:id',
    title: 'Détail de la catégorie',
    loadComponent: () =>
      import('./features/categories/category-detail/category-detail').then((m) => m.CategoryDetail),
  },
  // Route en plus du sujet : sans elle on ne pourrait pas modifier une catégorie (CRUD complet)
  {
    path: 'categories/:id/edit',
    title: 'Modifier la catégorie',
    loadComponent: () =>
      import('./features/categories/category-form/category-form').then((m) => m.CategoryForm),
  },
  {
    path: 'favorites',
    title: 'Favoris',
    loadComponent: () =>
      import('./features/favorites/favorites/favorites').then((m) => m.Favorites),
  },
  // URL inconnue : retour au dashboard
  { path: '**', redirectTo: '' },
];
