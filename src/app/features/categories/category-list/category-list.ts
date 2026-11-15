import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Category } from '../../../core/models/category.model';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-category-list',
  imports: [RouterLink],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export class CategoryList {
  private readonly categoryService = inject(CategoryService);

  // Signal en lecture seule du service, lu dans le template avec categories()
  readonly categories = this.categoryService.categories;

  // Message affiché quand la suppression est refusée
  readonly errorMessage = signal<string | null>(null);

  remove(category: Category): void {
    if (!window.confirm(`Supprimer la catégorie « ${category.name} » ?`)) return;
    try {
      this.categoryService.remove(category.id);
      this.errorMessage.set(null);
    } catch (error) {
      // Cas typique : la catégorie contient encore des contacts
      this.errorMessage.set(error instanceof Error ? error.message : 'Erreur inattendue.');
    }
  }
}
