import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  // Lit une liste ; si la clé manque ou si le JSON est cassé, on renvoie []
  getList<T>(key: string): T[] {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T[]) : [];
    } catch (error) {
      console.error(`Lecture impossible de "${key}" dans le localStorage`, error);
      return [];
    }
  }

  // Écrit une liste ; on relance une erreur claire si ça échoue (quota plein, etc.)
  setList<T>(key: string, items: T[]): void {
    try {
      localStorage.setItem(key, JSON.stringify(items));
    } catch (error) {
      console.error(`Écriture impossible de "${key}" dans le localStorage`, error);
      throw new Error(
        "Impossible d'enregistrer les données (stockage du navigateur plein ou désactivé).",
        { cause: error },
      );
    }
  }
}
