import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IMeal } from 'src/app/shared/interfaces/meal';
import { CalendarService } from 'src/app/shared/services/calendar.service';

@Component({
  selector: 'app-view-meal-page',
  templateUrl: './view-meal-page.component.html',
  styleUrls: ['./view-meal-page.component.scss']
})
export class ViewMealPageComponent implements OnInit {

  date!: Date;
  time!: number;

  meal!: IMeal;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private calendarService: CalendarService
  ) { }

  ngOnInit(): void {
    const snapshot = this.route.snapshot.queryParams;
    this.date = new Date(snapshot['date']);
    this.time = snapshot['time'];

    const meal = this.calendarService.getMeal(this.date, this.time)
    if (meal) this.meal = meal;
    else this.router.navigate(['/calendar'])
  }
}
