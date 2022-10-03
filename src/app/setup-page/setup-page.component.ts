import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { IProfile } from '../shared/interfaces/profile';
import { CalendarService } from '../shared/services/calendar.service';

@Component({
  selector: 'app-setup-page',
  templateUrl: './setup-page.component.html',
  styleUrls: ['./setup-page.component.scss']
})
export class SetupPageComponent implements OnInit {

  genderTypes: string[] = ['Male', 'Female']

  profile$!: BehaviorSubject<IProfile>;

  allParams!: FormGroup;

  validators: ValidatorFn[] = [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)];

  constructor(
    private calendarService: CalendarService
  ) { }

  ngOnInit(): void {
    this.profile$ = this.calendarService.getProfile();
    this.allParams = new FormGroup({
      bodyParams: new FormGroup({
        gender: new FormControl(this.profile$.getValue().gender),
        weight: new FormControl(this.profile$.getValue().weight, this.validators),
        height: new FormControl(this.profile$.getValue().height, this.validators)
      }),
      minKcal: new FormControl(this.profile$.getValue().minKcal, this.validators),
      maxKcal: new FormControl(this.profile$.getValue().maxKcal, this.validators),
      fats: new FormControl(this.profile$.getValue().fats, this.validators),
      proteins: new FormControl(this.profile$.getValue().proteins, this.validators),
      carbohydrates: new FormControl(this.profile$.getValue().carbohydrates, this.validators)
    })
  }

  onSubmitAllParams() {
    const bodyParams = this.allParams.value.bodyParams;
    const allParams = this.allParams.value;
    delete allParams.bodyParams;
    this.calendarService.setProfile(Object.assign(bodyParams, allParams));
  }

  calculateRate() {
    const bodyParams = this.allParams.value.bodyParams;
    const REE = this.calendarService.calculateREE(bodyParams.weight, bodyParams.height, bodyParams.gender);

    this.allParams.patchValue({
      minKcal: Math.round(REE - 300),
      maxKcal: Math.round(REE + 100),
      fats: Math.round(REE / 4 / 9),
      proteins: Math.round(REE / 4 / 4),
      carbohydrates: Math.round(REE / 2 / 4)
    })
  }
}
