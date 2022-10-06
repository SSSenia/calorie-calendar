import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
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

  days$: BehaviorSubject<IDay[]> = new BehaviorSubject<IDay[]>([]);
  profile$: BehaviorSubject<IProfile> = new BehaviorSubject(DEFAULT_PROFILE);

  subToProfile!: Subscription;

  userEmail: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private auth: AuthService) {
    this.auth.user$.subscribe((user) => {
      if (user?.email){
        this.userEmail.next(user.email);
        const localProfile = localStorage.getItem(user.email + 'profile');
        if (localProfile) this.profile$.next(JSON.parse(localProfile));
      }
    })
  }

  getProfile() {
    return this.profile$;
  }

  setProfile(newProfile: IProfile) {
    this.profile$.next(newProfile);
    localStorage.setItem(this.userEmail.getValue() + 'profile', JSON.stringify(this.profile$.getValue()));
  }

  getWeek(date: Date): Observable<IDay[]> {
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
    return of(week);
  }

  setMeal(meal: IMeal, date: Date, hour: number) {
    const search = this.days$.getValue().find(x => x.date.getTime() == date.getTime());
    if (search) {
      search.meals[hour] = meal;
    }
    else {
      const meals: IMeal[] = [];
      meals.length = 24;
      meals[hour] = meal;
      const days = this.days$.getValue()
      days.push({ date: date, meals: meals })
      this.days$.next(days);
    }
    this.setDayToLocal(date)
  }

  getMeal(date: Date, time: number): Observable<IMeal | undefined> {
    return of(this.getDay(date).meals[time]);
  }

  getDay(date: Date) {
    const search = this.days$.getValue().find(x => x.date.getTime() == date.getTime());
    return search ? search : this.getDayFromLocal(date);
  }

  setDayToLocal(date: Date) {
    const key = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
    localStorage.setItem(this.userEmail.getValue() + key, JSON.stringify(this.days$.getValue().find(x => x.date.getTime() == date.getTime())));
  }

  getDayFromLocal(date: Date): IDay {
    const data = JSON.parse(
      localStorage.getItem(this.userEmail.getValue() + date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate())
      ?? `{
      "date": "${date}",
      "meals": []
    }`);
    data.date = new Date(data.date);
    const days = this.days$.getValue();
    days.push(data);
    this.days$.next(days);
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
