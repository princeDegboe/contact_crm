export interface Category {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

// Ce que fournit le formulaire, le reste est généré par le service
export type CategoryInput = Omit<Category, 'id' | 'createdAt'>;
