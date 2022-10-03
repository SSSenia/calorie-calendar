import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarService } from 'src/app/shared/services/calendar.service';

@Component({
  selector: 'app-new-meal-page',
  templateUrl: './new-meal-page.component.html',
  styleUrls: ['./new-meal-page.component.scss']
})
export class NewMealPageComponent implements OnInit {

  date!: Date;
  time!: number;
  selectedImage: null | string = null;
  classForDrop = false;

  validators: ValidatorFn[] = [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)];

  dinnerParams: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    kcal: new FormControl('', this.validators),
    time: new FormControl('', this.validators.concat([
      (control: AbstractControl) => +control.value < 24 && +control.value >= 0 ? null : { passwordStrength: true }])),
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
    this.date = new Date(this.calendarService.formatDate(new Date(snapshot['date'])));
    this.time = snapshot['time'];
    console.log(snapshot);
    
    if(this.date instanceof Date && !isNaN(+this.date) && typeof +this.time == 'number' && this.time < 24 && this.time >= 0){
      this.dinnerParams.patchValue({ time: this.time });
    }
    else this.router.navigate(['/calendar'])
    
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
