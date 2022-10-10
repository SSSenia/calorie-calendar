import { IProfile } from "./interfaces/profile";

//REE = 9.99 x weight + 6.25 x height - 4.92 x age + 166 x sex (males, 1; females, 0) - 161
export const DEFAULT_PROFILE: IProfile = {
    gender: 'Male',
    weight: 76,
    height: 196,
    minKcal: 1586,//-300
    maxKcal: 1986,//+100
    fats: 52, //1886 / 4 / 9
    proteins: 118, //1886 / 4 / 4
    carbohydrates: 236 //1886 / 2 / 4
  }

// 1000ms * 60s * 60m * 24h
export const ONE_DAY = 86400000;