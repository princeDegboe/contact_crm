import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Contact } from '../../../core/models/contact.model';
import { CategoryService } from '../../../core/services/category.service';
import { ContactService } from '../../../core/services/contact.service';
import { ContactCard } from '../../../shared/components/contact-card/contact-card';

type SortOption = 'name-asc' | 'name-desc' | 'date-desc' | 'date-asc';

@Component({
  selector: 'app-contact-list',
  imports: [RouterLink, ContactCard],
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.css',
})
export class ContactList {
  private readonly contactService = inject(ContactService);
  private readonly categoryService = inject(CategoryService);

  readonly categories = this.categoryService.categories;

  // Filtres et tri choisis par l'utilisateur
  readonly search = signal('');
  readonly categoryId = signal(''); // '' = toutes les catégories
  readonly favoritesOnly = signal(false);
  readonly sort = signal<SortOption>('name-asc');

  readonly errorMessage = signal<string | null>(null);

  // Liste affichée : recalculée dès qu'un filtre, le tri ou les contacts changent
  readonly filteredContacts = computed(() => {
    const term = this.search().trim().toLowerCase();
    const categoryId = this.categoryId();
    const favoritesOnly = this.favoritesOnly();

    const result = this.contactService.contacts().filter((contact) => {
      const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
      return (
        (term === '' || fullName.includes(term)) &&
        (categoryId === '' || contact.categoryId === categoryId) &&
        (!favoritesOnly || contact.favorite)
      );
    });

    // filter() a déjà créé un nouveau tableau, on peut le trier sans toucher au signal du service
    return result.sort((a, b) => this.compare(a, b, this.sort()));
  });

  onSortChange(value: string): void {
    this.sort.set(value as SortOption);
  }

  toggleFavorite(contact: Contact): void {
    this.run(() => this.contactService.toggleFavorite(contact.id));
  }

  remove(contact: Contact): void {
    if (!window.confirm(`Supprimer ${contact.firstName} ${contact.lastName} ?`)) return;
    this.run(() => this.contactService.remove(contact.id));
  }

  // Exécute une action et affiche l'erreur éventuelle (stockage plein, etc.)
  private run(action: () => void): void {
    try {
      action();
      this.errorMessage.set(null);
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'Erreur inattendue.');
    }
  }

  private compare(a: Contact, b: Contact, sort: SortOption): number {
    switch (sort) {
      case 'name-asc':
        return this.compareNames(a, b);
      case 'name-desc':
        return this.compareNames(b, a);
      case 'date-desc':
        // Les dates ISO se comparent correctement comme du texte
        return b.createdAt.localeCompare(a.createdAt);
      case 'date-asc':
        return a.createdAt.localeCompare(b.createdAt);
    }
  }

  // Tri par nom puis prénom, en tenant compte des accents (locale fr)
  private compareNames(a: Contact, b: Contact): number {
    return (
      a.lastName.localeCompare(b.lastName, 'fr') || a.firstName.localeCompare(b.firstName, 'fr')
    );
  }
}
