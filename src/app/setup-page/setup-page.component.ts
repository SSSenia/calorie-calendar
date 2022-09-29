import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-setup-page',
  templateUrl: './setup-page.component.html',
  styleUrls: ['./setup-page.component.scss']
})
export class SetupPageComponent implements OnInit {

  genderTypes: string[] = ['Male', 'Female']

  allParams: FormGroup = new FormGroup({
    bodyParams: new FormGroup({
      gender: new FormControl('Male'),
      weight: new FormControl(76),
      height: new FormControl(200)
    }),
    minKcal: new FormControl(2000),
    maxKcal: new FormControl(2000),
    fats: new FormControl(55),
    proteins: new FormControl(55),
    carbohydrates: new FormControl(55)
  })


  constructor() { }

  ngOnInit(): void {
  }

  onSubmitAllParams() {
    console.log(this.allParams.controls);

  }
  onSubmitBodyParams() {
    console.log(this.allParams.controls['bodyParams'].value);
  }
}
