import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DEFAULT_PROFILE, ONE_DAY } from '../const';
import { IDay } from '../interfaces/day';
import { IMeal } from '../interfaces/meal';
import { IProfile } from '../interfaces/profile';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  private days: IDay[] = [];
  private profile: IProfile = DEFAULT_PROFILE;
  private userEmail: string = '';

  constructor(private auth: AuthService) {
    this.auth.user$.subscribe((user) => {
      if (user?.email) {
        this.userEmail = user.email;
        const localProfile = localStorage.getItem(user.email + 'profile');
        if (localProfile) this.profile = JSON.parse(localProfile);
      }
    })
  }

  public getProfile(): IProfile {
    return this.profile;
  }

  public setProfile(newProfile: IProfile) {
    this.profile = newProfile;
    localStorage.setItem(this.userEmail + 'profile', JSON.stringify(this.profile));
  }

  public getWeek(date: Date): IDay[] {
    date = new Date(this.formatDate(date));
    const week: IDay[] = [];
    let begin = date.getTime() - (date.getDay() * ONE_DAY);
    for (let i = 0; i < 7; i++) {
      const day = this.getDay(new Date(begin));
      if (!day.meals.length)
        day.meals.length = 24;
      week.push(day);
      begin += ONE_DAY;
    }
    return week;
  }

  public setMeal(meal: IMeal, date: Date, hour: number) {
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

  public getMeal(date: Date, time: number): IMeal | undefined {
    return this.getDay(date).meals[time];
  }

  public getDay(date: Date) {
    const search = this.days.find(x => x.date.getTime() == date.getTime());
    return search ? search : this.getDayFromLocal(date);
  }

  private setDayToLocal(date: Date) {
    const key = this.formatDate(date);
    const obj = JSON.stringify(this.days.find(x => x.date.getTime() == date.getTime()));
    localStorage.setItem(this.userEmail + key, obj);
  }

  private getDayFromLocal(date: Date): IDay {
    const data = JSON.parse(
      localStorage.getItem(this.userEmail +this.formatDate(date))
      ?? `{
      "date": "${date}",
      "meals": []
    }`);
    data.date = new Date(data.date);
    this.days.push(data);
    return data;
  }

  public formatDate(date: Date) {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  }

  public calculateREE(weight: number, height: number, gender: string) {
    return 9.99 * weight
      + 6.25 * height
      - 4.92 * 21
      + (gender == 'Male' ? 166 : 0)
      - 161;
  }

  public isFileImage(file: File) {
    const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/svg'];
    return file && acceptedImageTypes.includes(file['type'])
  }
}
