import { Component, OnInit } from '@angular/core';

interface IMeal{

}

@Component({
  selector: 'app-calendar-page',
  templateUrl: './calendar-page.component.html',
  styleUrls: ['./calendar-page.component.scss']
})
export class CalendarPageComponent implements OnInit {

  kcalDays = [1350, 1515, 1350, 900, 0, 0, 0]
  days = [5, 6, 7, 8, 9, 10, 11]
  weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  time: number[] = [];
  food: any[][] = []

  constructor() { }

  ngOnInit(): void {
    for (let i = 0; i <= 24; i++)
      this.time.push(i);
    
    for (let i = 0; i < 7; i++)
      this.food.push(this.time)
  }

  getRand(){
    return Math.random() > 0.7;
  }
}
