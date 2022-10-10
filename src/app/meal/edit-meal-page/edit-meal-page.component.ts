import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, AbstractControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IMeal } from 'src/app/shared/interfaces/meal';
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
  meal!: IMeal | undefined;
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
    this.meal = this.calendarService.getMeal(this.date, this.time);
    if (this.meal) {
      this.dinnerParams.patchValue(this.meal)
      this.selectedImage = this.meal.image ? this.meal.image : null;
    }
    else this.router.navigate(['/meal', 'new'], this.route.snapshot.queryParams)
  }

  onSubmit() {
    if (!this.dinnerParams.invalid) {
      this.router.navigate(['/calendar'])
      this.calendarService.setMeal(Object.assign(this.dinnerParams.value, { image: this.selectedImage }), this.date, this.time);
    }
  }

  onFileSelected(event: any) {
    let file = event.target.files[0];
    let reader = new FileReader();
    if (this.calendarService.isFileImage(file)) {
      reader.onload = (e) => {
        if (e.target && typeof e.target!.result == 'string') {
          this.selectedImage = e.target.result;
        }
      }
      reader.readAsDataURL(file);
    }
  }
}
