import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartPageComponent } from './start-page/start-page.component';
import { CalendarPageComponent } from './calendar-page/calendar-page.component';
import { SetupPageComponent } from './setup-page/setup-page.component';
import { ViewDayPageComponent } from './view-day-page/view-day-page.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { StartGuard } from './shared/guards/start.guard';

const routes: Routes = [
  { path: '', redirectTo: '/start', pathMatch: 'full' },
  { path: 'start', component: StartPageComponent },
  { path: 'calendar', component: CalendarPageComponent },
  { path: 'setup', component: SetupPageComponent },
  { path: 'view-day', component: ViewDayPageComponent },
  { path: 'meal', loadChildren: () => import('./meal/meal.module').then(m => m.MealModule) },
  { path: '**', redirectTo: '/calendar' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
