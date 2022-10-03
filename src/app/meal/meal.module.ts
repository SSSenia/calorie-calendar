import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EditMealPageComponent } from './edit-meal-page/edit-meal-page.component';
import { ViewMealPageComponent } from './view-meal-page/view-meal-page.component';
import { NewMealPageComponent } from './new-meal-page/new-meal-page.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    NewMealPageComponent,
    EditMealPageComponent,
    ViewMealPageComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      { path: 'edit', component: EditMealPageComponent },
      { path: 'view', component: ViewMealPageComponent },
      { path: 'new', component: NewMealPageComponent }
    ])
  ]
})
export class MealModule { }
