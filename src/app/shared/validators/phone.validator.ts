import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Un validator renvoie null si tout va bien, ou un objet d'erreur sinon
export const phoneValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = String(control.value ?? '').trim();
  // Champ vide : on laisse passer (le téléphone est facultatif)
  if (value === '') return null;

  // Caractères autorisés : +, chiffres, espaces, points, tirets, parenthèses
  const validChars = /^\+?[\d\s().-]+$/.test(value);
  // Entre 8 et 15 chiffres (norme internationale)
  const digitsCount = value.replace(/\D/g, '').length;

  return validChars && digitsCount >= 8 && digitsCount <= 15 ? null : { phone: true };
};
