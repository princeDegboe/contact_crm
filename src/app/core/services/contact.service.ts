import { Injectable, inject, signal } from '@angular/core';
import { Contact, ContactInput } from '../models/contact.model';
import { generateId } from '../utils/id.util';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'crm_contacts';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly storage = inject(StorageService);

  // Source de vérité, chargée une fois au démarrage
  private readonly _contacts = signal<Contact[]>(this.storage.getList<Contact>(STORAGE_KEY));
  readonly contacts = this._contacts.asReadonly();

  getById(id: string): Contact | undefined {
    return this._contacts().find((contact) => contact.id === id);
  }

  add(input: ContactInput): Contact {
    const now = new Date().toISOString();
    const contact: Contact = { ...input, id: generateId(), createdAt: now, updatedAt: now };
    this.persist([...this._contacts(), contact]);
    return contact;
  }

  update(id: string, input: ContactInput): Contact {
    const existing = this.getById(id);
    if (!existing) throw new Error('Contact introuvable.');
    // On garde id et createdAt, seul updatedAt change
    const updated: Contact = { ...existing, ...input, updatedAt: new Date().toISOString() };
    this.persist(this._contacts().map((c) => (c.id === id ? updated : c)));
    return updated;
  }

  toggleFavorite(id: string): void {
    const existing = this.getById(id);
    if (!existing) throw new Error('Contact introuvable.');
    this.update(id, { ...existing, favorite: !existing.favorite });
  }

  remove(id: string): void {
    this.persist(this._contacts().filter((contact) => contact.id !== id));
  }

  // Écrit d'abord dans le localStorage : si ça échoue, le signal reste inchangé
  private persist(contacts: Contact[]): void {
    this.storage.setList(STORAGE_KEY, contacts);
    this._contacts.set(contacts);
  }
}
