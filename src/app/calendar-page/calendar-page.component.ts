import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ONE_DAY } from '../shared/const';
import { IDay } from '../shared/interfaces/day';
import { IProfile } from '../shared/interfaces/profile';
import { CalendarService } from '../shared/services/calendar.service';

@Component({
  selector: 'app-calendar-page',
  templateUrl: './calendar-page.component.html',
  styleUrls: ['./calendar-page.component.scss']
})
export class CalendarPageComponent implements OnInit, OnDestroy {

  public kcalDays!: number[];
  public time: number[] = [];
  public profile!: IProfile;
  public days!: IDay[];
  public dateNow = new Date(this.calendarService.formatDate(new Date()));
  
  private subDate!: Subscription;

  public form: FormGroup = new FormGroup({
    date: new FormControl(this.dateNow)
  });

  constructor(
    private calendarService: CalendarService
  ) { }

  public ngOnInit(): void {
    this.subDate = this.form.valueChanges.subscribe((value) => {
      this.changeWeek(value.date);
    })
    this.profile = this.calendarService.getProfile();
    this.changeWeek(new Date);
    for (let i = 0; i < 24; i++)
      this.time.push(i);
  }

  public ngOnDestroy(): void {
    this.subDate.unsubscribe();
  }

  public changeWeek(newDate: Date) {
    this.days = this.calendarService.getWeek(newDate);
    this.kcalDays = this.days
      .map((day) => day.meals.reduce(
        (sum, current) => sum + +(current ? current.kcal : 0), 0));
  }

  public onSwipe(side: string) {
    const oneWeek = ONE_DAY * 7;
    if (side == 'right')
      this.form.patchValue({ date: new Date(+this.form.value.date - oneWeek) });
    if (side == 'left')
      this.form.patchValue({ date: new Date(+this.form.value.date + oneWeek) });
  }
}
