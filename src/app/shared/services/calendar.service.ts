import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
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
  profile: IProfile = DEFAULT_PROFILE;
  userEmail: string = '';

  constructor(private auth: AuthService) {
    this.auth.user$.subscribe((user) => {
      if (user?.email) {
        this.userEmail = user.email;
        const localProfile = localStorage.getItem(user.email + 'profile');
        if (localProfile) this.profile = JSON.parse(localProfile);
      }
    })
  }

  getProfile(): IProfile {
    return this.profile;
  }

  setProfile(newProfile: IProfile) {
    this.profile = newProfile;
    localStorage.setItem(this.userEmail + 'profile', JSON.stringify(this.profile));
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
      const days = this.days
      days.push({ date: date, meals: meals })
      this.days = days;
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
    const key = this.formatDate(date);
    localStorage.setItem(this.userEmail + key, JSON.stringify(this.days.find(x => x.date.getTime() == date.getTime())));
  }

  getDayFromLocal(date: Date): IDay {
    const data = JSON.parse(
      localStorage.getItem(this.formatDate(date))
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

  isFileImage(file: File) {
    const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/svg'];
    return file && acceptedImageTypes.includes(file['type'])
  }
}
