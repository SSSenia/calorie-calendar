import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IMeal } from 'src/app/shared/interfaces/meal';
import { CalendarService } from 'src/app/shared/services/calendar.service';
import { hourRange } from 'src/app/shared/validators';

@Component({
  selector: 'app-edit-meal-page',
  templateUrl: './edit-meal-page.component.html',
  styleUrls: ['../input-meal.scss']
})
export class EditMealPageComponent implements OnInit {

  public date!: Date;
  public time!: number;
  public selectedImage: null | string = null;
  public meal!: IMeal | undefined;
  public classForDrop = false;

  private validators = [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)];

  public dinnerParams: FormGroup = this.formBuilder.group({
    title: ['', [Validators.required]],
    kcal: ['', this.validators],
    time: ['', this.validators.concat([hourRange])],
    fats: ['', this.validators],
    proteins: ['', this.validators],
    carbohydrates: ['', this.validators]
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private calendarService: CalendarService,
    private formBuilder: FormBuilder
  ) { }

  public ngOnInit(): void {
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

  public onSubmit() {
    if (!this.dinnerParams.invalid) {
      this.router.navigate(['/calendar'])
      this.calendarService.setMeal(Object.assign(this.dinnerParams.value, { image: this.selectedImage }), this.date, this.time);
    }
  }

  public onFileSelected(event: any) {
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
