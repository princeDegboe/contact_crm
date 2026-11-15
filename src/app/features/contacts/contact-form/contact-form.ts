import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';
import { ContactService } from '../../../core/services/contact.service';
import { phoneValidator } from '../../../shared/validators/phone.validator';

// Un @, du texte avant, un point après le @, pas d'espaces
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.css',
})
export class ContactForm {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly contactService = inject(ContactService);
  private readonly categoryService = inject(CategoryService);

  // L'id n'est dans l'URL qu'en mode édition (/contacts/:id/edit)
  private readonly id = this.route.snapshot.paramMap.get('id');
  readonly isEdit = this.id !== null;

  // Pour remplir la liste déroulante des catégories
  readonly categories = this.categoryService.categories;
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
    phone: ['', phoneValidator],
    company: [''],
    jobTitle: [''],
    categoryId: ['', Validators.required],
    notes: [''],
    favorite: [false],
  });

  constructor() {
    if (this.id) {
      const contact = this.contactService.getById(this.id);
      if (!contact) {
        // id inconnu : on retourne à la liste
        this.router.navigate(['/contacts']);
        return;
      }
      // Préremplit le formulaire avec le contact existant
      this.form.patchValue(contact);
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    try {
      if (this.id) {
        this.contactService.update(this.id, value);
      } else {
        this.contactService.add(value);
      }
      this.router.navigate(['/contacts']);
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'Erreur inattendue.');
    }
  }
}
