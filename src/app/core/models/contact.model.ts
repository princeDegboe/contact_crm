export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  categoryId: string;
  favorite: boolean;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// Ce que fournit le formulaire, le reste est généré par le service
export type ContactInput = Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>;
