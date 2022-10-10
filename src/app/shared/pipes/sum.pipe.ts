import { Pipe, PipeTransform } from "@angular/core";
import { IDay } from "../interfaces/day";

@Pipe({
    name: 'sum'
})
export class SumPipe implements PipeTransform {
    transform(day: IDay, type: string) {
        let func;
        switch (type) {
            case 'kcal':
                func = (prev: number, current: any) => current ? prev + +current.kcal : prev;
                break;
            case 'fats':
                func = (prev: number, current: any) => current ? prev + +current.fats : prev;
                break;
            case 'proteins':
                func = (prev: number, current: any) => current ? prev + +current.proteins : prev;
                break;
            case 'carbohydrates':
                func = (prev: number, current: any) => current ? prev + +current.carbohydrates : prev;
                break;
            default:
                return 0;
        }
        return day.meals.reduce(func, 0)
    }
}