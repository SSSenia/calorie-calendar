import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, AbstractControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarService } from 'src/app/shared/services/calendar.service';

@Component({
  selector: 'app-edit-meal-page',
  templateUrl: './edit-meal-page.component.html',
  styleUrls: ['./edit-meal-page.component.scss']
})
export class EditMealPageComponent implements OnInit {

  date!: Date;
  time!: number;
  selectedImage: null | string = null;

  classForDrop = false;

  validators = [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)];

  dinnerParams: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    kcal: new FormControl('', this.validators),
    time: new FormControl('', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/),
    (control: AbstractControl) => +control.value < 24 && +control.value >= 0 ? null : { passwordStrength: true }]),
    fats: new FormControl('', this.validators),
    proteins: new FormControl('', this.validators),
    carbohydrates: new FormControl('', this.validators)
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private calendarService: CalendarService
  ) { }

  ngOnInit(): void {
    const snapshot = this.route.snapshot.queryParams;
    this.date = new Date(snapshot['date']);
    this.time = snapshot['time'];
    this.dinnerParams.patchValue({ time: this.time });
    const meal = this.calendarService.getMeal(this.date, this.time);
    if (meal) {
      this.dinnerParams.patchValue(meal)
      this.selectedImage = meal.image ? meal.image : null;
    }
    else this.router.navigate(['/meal', 'new'], this.route.snapshot.queryParams)
  }

  onSubmit() {
    if (!this.dinnerParams.invalid) {
      this.router.navigate(['/calendar'])
      this.calendarService.setMeal(Object.assign(this.dinnerParams.value, { image: this.selectedImage }), this.date, this.time);
    }
  }

  isFileImage(file: File) {
    const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/svg'];
    return file && acceptedImageTypes.includes(file['type'])
  }

  onFileSelected(event: any) {
    let file = event.target.files[0];
    let reader = new FileReader();
    if (this.isFileImage(file)) {
      reader.onload = (e) => {
        if (e.target && typeof e.target!.result == 'string') {
          this.selectedImage = e.target.result;
        }
      }
      reader.readAsDataURL(file);
    }
  }
}
