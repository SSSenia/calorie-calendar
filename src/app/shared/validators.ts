import { AbstractControl } from "@angular/forms";

export const hourRange = (control: AbstractControl) => +control.value < 24 && +control.value >= 0 ? null : { passwordStrength: true };