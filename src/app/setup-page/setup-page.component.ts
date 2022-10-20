import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { IProfile } from '../shared/interfaces/profile';
import { CalendarService } from '../shared/services/calendar.service';

@Component({
  selector: 'app-setup-page',
  templateUrl: './setup-page.component.html',
  styleUrls: ['./setup-page.component.scss']
})
export class SetupPageComponent implements OnInit {

  public genderTypes: string[] = ['Male', 'Female']
  public allParams!: FormGroup;
  
  private profile!: IProfile;
  private validators: ValidatorFn[] = [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)];

  constructor(
    private calendarService: CalendarService,
    private router: Router,
    private formBuilder: FormBuilder,
    @Inject(DOCUMENT) public document: Document, public auth: AuthService
  ) { }

  public ngOnInit(): void {
    this.profile = this.calendarService.getProfile();
    this.allParams = this.formBuilder.group({
      bodyParams: this.formBuilder.group({
        gender: [this.profile.gender],
        weight: [this.profile.weight, this.validators],
        height: [this.profile.height, this.validators]
      }),
      minKcal: [this.profile.minKcal, this.validators],
      maxKcal: [this.profile.maxKcal, this.validators],
      fats: [this.profile.fats, this.validators],
      proteins: [this.profile.proteins, this.validators],
      carbohydrates: [this.profile.carbohydrates, this.validators]
    })
  }

  public onSubmitAllParams() {
    const bodyParams = this.allParams.value.bodyParams;
    const allParams = this.allParams.value;
    delete allParams.bodyParams;
    this.calendarService.setProfile(Object.assign(bodyParams, allParams));
    this.router.navigate(['/calendar'])
  }

  public calculateRate() {
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
