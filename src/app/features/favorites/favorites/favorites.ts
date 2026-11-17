import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Contact } from '../../../core/models/contact.model';
import { ContactService } from '../../../core/services/contact.service';
import { ContactCard } from '../../../shared/components/contact-card/contact-card';

@Component({
  selector: 'app-favorites',
  imports: [RouterLink, ContactCard],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class Favorites {
  private readonly contactService = inject(ContactService);

  readonly errorMessage = signal<string | null>(null);

  // Recalculé dès qu'un contact change : retirer un favori le fait disparaître de la page
  readonly favorites = computed(() =>
    this.contactService
      .contacts()
      .filter((contact) => contact.favorite)
      .sort(
        (a, b) =>
          a.lastName.localeCompare(b.lastName, 'fr') ||
          a.firstName.localeCompare(b.firstName, 'fr'),
      ),
  );

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
}
