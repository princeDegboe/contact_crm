import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';
import { ContactService } from '../../../core/services/contact.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly contactService = inject(ContactService);
  private readonly categoryService = inject(CategoryService);

  readonly totalContacts = computed(() => this.contactService.contacts().length);

  readonly totalFavorites = computed(
    () => this.contactService.contacts().filter((contact) => contact.favorite).length,
  );

  readonly totalCategories = computed(() => this.categoryService.categories().length);

  // 5 derniers contacts ajoutés (copie du tableau : sort() modifie l'original)
  readonly latestContacts = computed(() =>
    [...this.contactService.contacts()]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 5),
  );

  // Nombre de contacts par catégorie
  readonly categoryStats = computed(() => {
    const contacts = this.contactService.contacts();
    return this.categoryService.categories().map((category) => ({
      category,
      count: contacts.filter((contact) => contact.categoryId === category.id).length,
    }));
  });
}
