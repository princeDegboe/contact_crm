import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';
import { ContactService } from '../../../core/services/contact.service';

@Component({
  selector: 'app-contact-detail',
  imports: [RouterLink, DatePipe],
  templateUrl: './contact-detail.html',
  styleUrl: './contact-detail.css',
})
export class ContactDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly contactService = inject(ContactService);
  private readonly categoryService = inject(CategoryService);

  // Id lu dans l'URL (/contacts/:id)
  private readonly id = this.route.snapshot.paramMap.get('id') ?? '';

  // undefined si l'id ne correspond à aucun contact
  readonly contact = computed(() => this.contactService.getById(this.id));

  readonly category = computed(() => {
    const contact = this.contact();
    return contact ? this.categoryService.getById(contact.categoryId) : undefined;
  });

  readonly errorMessage = signal<string | null>(null);

  toggleFavorite(): void {
    try {
      this.contactService.toggleFavorite(this.id);
      this.errorMessage.set(null);
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'Erreur inattendue.');
    }
  }

  remove(): void {
    const contact = this.contact();
    if (!contact) return;
    if (!window.confirm(`Supprimer ${contact.firstName} ${contact.lastName} ?`)) return;
    try {
      this.contactService.remove(contact.id);
      // Le contact n'existe plus : retour à la liste
      this.router.navigate(['/contacts']);
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'Erreur inattendue.');
    }
  }
}
