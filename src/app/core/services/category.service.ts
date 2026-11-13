import { Injectable, inject, signal } from '@angular/core';
import { Category, CategoryInput } from '../models/category.model';
import { generateId } from '../utils/id.util';
import { ContactService } from './contact.service';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'crm_categories';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly storage = inject(StorageService);
  private readonly contactService = inject(ContactService);

  private readonly _categories = signal<Category[]>(this.storage.getList<Category>(STORAGE_KEY));
  readonly categories = this._categories.asReadonly();

  getById(id: string): Category | undefined {
    return this._categories().find((category) => category.id === id);
  }

  add(input: CategoryInput): Category {
    const category: Category = {
      ...input,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    this.persist([...this._categories(), category]);
    return category;
  }

  update(id: string, input: CategoryInput): Category {
    const existing = this.getById(id);
    if (!existing) throw new Error('Catégorie introuvable.');
    const updated: Category = { ...existing, ...input };
    this.persist(this._categories().map((c) => (c.id === id ? updated : c)));
    return updated;
  }

  remove(id: string): void {
    // Règle métier : on ne supprime pas une catégorie encore utilisée
    const used = this.contactService.contacts().filter((c) => c.categoryId === id).length;
    if (used > 0) {
      throw new Error(
        `Suppression impossible : cette catégorie contient encore ${used} contact(s).`,
      );
    }
    this.persist(this._categories().filter((category) => category.id !== id));
  }

  private persist(categories: Category[]): void {
    this.storage.setList(STORAGE_KEY, categories);
    this._categories.set(categories);
  }
}
