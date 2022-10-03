import { NgModule } from '@angular/core';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DATE_LOCALE } from '@angular/material/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StartPageComponent } from './start-page/start-page.component';
import { SetupPageComponent } from './setup-page/setup-page.component';
import { CalendarPageComponent } from './calendar-page/calendar-page.component';
import { ViewDayPageComponent } from './view-day-page/view-day-page.component';
import { SharedModule } from './shared/shared.module';
import { MealModule } from './meal/meal.module';
import 'hammerjs'

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
    MealModule,
    HammerModule
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'ru-UA' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
