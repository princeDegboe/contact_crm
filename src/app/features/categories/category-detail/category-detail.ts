import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';
import { ContactService } from '../../../core/services/contact.service';

@Component({
  selector: 'app-category-detail',
  imports: [RouterLink, DatePipe],
  templateUrl: './category-detail.html',
  styleUrl: './category-detail.css',
})
export class CategoryDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly categoryService = inject(CategoryService);
  private readonly contactService = inject(ContactService);

  // Id lu dans l'URL (/categories/:id)
  private readonly id = this.route.snapshot.paramMap.get('id') ?? '';

  // undefined si l'id ne correspond à aucune catégorie
  readonly category = this.categoryService.getById(this.id);

  // Contacts de cette catégorie, recalculés si la liste des contacts change
  readonly contacts = computed(() =>
    this.contactService.contacts().filter((contact) => contact.categoryId === this.id),
  );
}
