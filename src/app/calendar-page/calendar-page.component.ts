import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { IDay } from '../shared/interfaces/day';
import { IProfile } from '../shared/interfaces/profile';
import { CalendarService } from '../shared/services/calendar.service';

@Component({
  selector: 'app-calendar-page',
  templateUrl: './calendar-page.component.html',
  styleUrls: ['./calendar-page.component.scss']
})
export class CalendarPageComponent implements OnInit, OnDestroy {

  kcalDays!: number[];
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  profile$!: BehaviorSubject<IProfile>;
  dateNow = new Date(this.calendarService.formatDate(new Date()));

  subDate!: Subscription;

  time: number[] = [];
  days: IDay[] = [];

  form: FormGroup = new FormGroup({
    date: new FormControl(this.dateNow)
  })

  constructor(
    private calendarService: CalendarService
  ) { }

  ngOnInit(): void {
    this.subDate = this.form.valueChanges.subscribe((value) => {
      this.changeWeek(value.date);
    })
    this.profile$ = this.calendarService.getProfile();
    this.changeWeek(new Date);
    for (let i = 0; i < 24; i++)
      this.time.push(i);
  }

  ngOnDestroy(): void {
    this.subDate.unsubscribe();
  }

  changeWeek(newDate: Date) {
    this.days = this.calendarService.getWeek(newDate);
    this.kcalDays = this.days
      .map((day) => day.meals.reduce(
        (sum, current) => sum + +(current ? current.kcal : 0), 0));
  }

  formatDate(date: Date) {
    return this.calendarService.formatDate(date);
  }
}
