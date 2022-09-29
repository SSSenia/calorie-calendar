import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StartPageComponent } from './start-page/start-page.component';
import { SetupPageComponent } from './setup-page/setup-page.component';
import { CalendarPageComponent } from './calendar-page/calendar-page.component';
import { ViewDayPageComponent } from './view-day-page/view-day-page.component';
import { SharedModule } from './shared/shared.module';
import { MealModule } from './meal/meal.module';

@NgModule({
  declarations: [
    AppComponent,
    StartPageComponent,
    SetupPageComponent,
    CalendarPageComponent,
    ViewDayPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    MealModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
