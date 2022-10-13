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
  { path: 'start', component: StartPageComponent, canMatch: [StartGuard]  },
  { path: 'calendar', component: CalendarPageComponent, canMatch: [AuthGuard] },
  { path: 'setup', component: SetupPageComponent, canMatch: [AuthGuard] },
  { path: 'view-day', component: ViewDayPageComponent, canMatch: [AuthGuard] },
  { path: 'meal', loadChildren: () => import('./meal/meal.module').then(m => m.MealModule), canMatch: [AuthGuard] },
  { path: '**', redirectTo: '/calendar' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
