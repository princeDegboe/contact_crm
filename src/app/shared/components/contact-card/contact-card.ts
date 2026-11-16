import { Component, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Contact } from '../../../core/models/contact.model';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-contact-card',
  imports: [RouterLink],
  templateUrl: './contact-card.html',
  styleUrl: './contact-card.css',
})
export class ContactCard {
  private readonly categoryService = inject(CategoryService);

  // Reçu du parent : le contact à afficher
  readonly contact = input.required<Contact>();

  // Événements envoyés au parent, qui décide quoi en faire
  readonly favoriteToggled = output<Contact>();
  readonly deleteRequested = output<Contact>();

  readonly category = computed(() => this.categoryService.getById(this.contact().categoryId));
}
