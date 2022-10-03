import { IMeal } from "./meal";

export interface IDay{
    date: Date,
    meals: Array<IMeal | undefined> 
}