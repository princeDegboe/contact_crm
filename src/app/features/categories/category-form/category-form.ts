import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-category-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css',
})
export class CategoryForm {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly categoryService = inject(CategoryService);

  // L'id n'est dans l'URL qu'en mode édition (/categories/:id/edit)
  private readonly id = this.route.snapshot.paramMap.get('id');
  readonly isEdit = this.id !== null;

  readonly errorMessage = signal<string | null>(null);

  // nonNullable : les champs valent toujours une string, jamais null
  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
    color: ['#3b82f6', Validators.required],
  });

  constructor() {
    if (this.id) {
      const category = this.categoryService.getById(this.id);
      if (!category) {
        // id inconnu : on retourne à la liste
        void this.router.navigate(['/categories']);
        return;
      }
      // Préremplit le formulaire avec la catégorie existante
      this.form.patchValue(category);
    }
  }

  submit(): void {
    if (this.form.invalid) {
      // Affiche les erreurs même sur les champs qu'on n'a pas touchés
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    try {
      if (this.id) {
        this.categoryService.update(this.id, value);
      } else {
        this.categoryService.add(value);
      }
      void this.router.navigate(['/categories']);
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'Erreur inattendue.');
    }
  }
}
