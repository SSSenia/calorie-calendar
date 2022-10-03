import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { IDay } from '../interfaces/day';
import { IMeal } from '../interfaces/meal';
import { IProfile } from '../interfaces/profile';

//REE = 9.99 x weight + 6.25 x height - 4.92 x age + 166 x sex (males, 1; females, 0) - 161
const DEFAULT_PROFILE: IProfile = {
  gender: 'Male',
  weight: 76,
  height: 196,
  minKcal: 1586,//-300
  maxKcal: 1986,//+100
  fats: 52, //1886 / 4 / 9
  proteins: 118, //1886 / 4 / 4
  carbohydrates: 236 //1886 / 2 / 4
}

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  days: IDay[] = [];
  profile: BehaviorSubject<IProfile> = new BehaviorSubject(DEFAULT_PROFILE);

  subToProfile!: Subscription;

  constructor() {
    const localProfile = localStorage.getItem('profile');
    if (localProfile) this.profile.next(JSON.parse(localProfile));
  }

  getProfile() {
    return this.profile;
  }

  setProfile(newProfile: IProfile) {
    this.profile.next(newProfile);
    localStorage.setItem('profile', JSON.stringify(this.profile.getValue()));
  }

  getWeek(date: Date): IDay[] {
    date = new Date(this.formatDate(date));
    const week: IDay[] = [];
    let begin = date.getTime() - (date.getDay() * 86400000);
    for (let i = 0; i < 7; i++) {
      const day = this.getDay(new Date(begin));
      if (!day.meals.length)
        day.meals.length = 24;
      week.push(day);
      begin += 86400000;
    }
    return week;
  }

  setMeal(meal: IMeal, date: Date, hour: number) {
    const search = this.days.find(x => x.date.getTime() == date.getTime());
    if (search) {
      search.meals[hour] = meal;
    }
    else {
      const meals: IMeal[] = [];
      meals.length = 24;
      meals[hour] = meal;
      this.days.push({ date: date, meals: meals })
    }
    this.setDayToLocal(date)
  }

  getMeal(date: Date, time: number): IMeal | undefined {
    return this.getDay(date).meals[time];
  }

  getDay(date: Date) {
    const search = this.days.find(x => x.date.getTime() == date.getTime());
    return search ? search : this.getDayFromLocal(date);
  }

  setDayToLocal(date: Date) {
    const key = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
    localStorage.setItem(key, JSON.stringify(this.days.find(x => x.date.getTime() == date.getTime())));
  }

  getDayFromLocal(date: Date): IDay {
    const data = JSON.parse(
      localStorage.getItem(date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate())
      ?? `{
      "date": "${date}",
      "meals": []
    }`);
    data.date = new Date(data.date);
    this.days.push(data);
    return data;
  }

  formatDate(date: Date) {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  }

  calculateREE(weight: number, height: number, gender: string) {
    return 9.99 * weight
      + 6.25 * height
      - 4.92 * 21
      + (gender == 'Male' ? 166 : 0)
      - 161;
  }
}
