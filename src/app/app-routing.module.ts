import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarPageComponent } from './calendar-page/calendar-page.component';
import { SetupPageComponent } from './setup-page/setup-page.component';
import { StartPageComponent } from './start-page/start-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/start', pathMatch: 'full' },
  { path: 'start', component: StartPageComponent },
  { path: 'calendar', component: CalendarPageComponent },
  { path: 'setup', component: SetupPageComponent },
  { path: 'meal/:id', loadChildren: ()=> import('./meal/meal.module').then(m => m.MealModule)},
  { path: '**', redirectTo: '/start' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
