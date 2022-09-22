import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NewMealPageComponent } from './new-meal-page/new-meal-page.component';
import { EditMealPageComponent } from './edit-meal-page/edit-meal-page.component';
import { ViewMealPageComponent } from './view-meal-page/view-meal-page.component';

@NgModule({
  declarations: [
    NewMealPageComponent,
    EditMealPageComponent,
    ViewMealPageComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: 'edit', component: EditMealPageComponent },
      { path: 'new', component: NewMealPageComponent },
      { path: 'view', component: ViewMealPageComponent }
    ])
  ]
})
export class MealModule { }
