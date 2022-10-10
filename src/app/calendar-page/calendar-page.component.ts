import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
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
  time: number[] = [];

  profile!: IProfile;
  days!: IDay[];

  subDate!: Subscription;

  dateNow = new Date(this.calendarService.formatDate(new Date()));

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
    this.profile = this.calendarService.getProfile();
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

  onSwipe(side: string) {
    const oneWeek = 86400000 * 7;
    if (side == 'right')
      this.form.patchValue({ date: new Date(+this.form.value.date - oneWeek) })
    if (side == 'left')
      this.form.patchValue({ date: new Date(+this.form.value.date + oneWeek) })
  }
}
