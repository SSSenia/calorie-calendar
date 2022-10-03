import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { IDay } from '../shared/interfaces/day';
import { CalendarService } from '../shared/services/calendar.service';

@Component({
  selector: 'app-view-day-page',
  templateUrl: './view-day-page.component.html',
  styleUrls: ['./view-day-page.component.scss']
})
export class ViewDayPageComponent implements OnInit {

  day$!: Observable<IDay>;

  constructor(
    private calendarService: CalendarService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const snapshot = this.route.snapshot.queryParams;
    this.day$ = of(this.calendarService.getDay(new Date(snapshot['date'])));
  }

  count(day: IDay, type: string): number {
    return day.meals.reduce((prev, current: any) => current ? prev + +current[type] : prev, 0)
  }

  formatDate(date: Date) {
    return this.calendarService.formatDate(date);
  }
}
