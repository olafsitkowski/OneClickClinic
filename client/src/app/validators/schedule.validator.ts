import { AbstractControl, ValidationErrors } from '@angular/forms';

export function endRequiredIfStartValidator(
  group: AbstractControl
): ValidationErrors | null {
  const start = group.get('start')?.value;
  const end = group.get('end')?.value;
  if (!start && end) {
    return { startRequired: true };
  }
  if (start && !end) {
    return { endRequired: true };
  }
  if (start && end && start >= end) {
    return { invalidTimeRange: true };
  }
  return null;
}
