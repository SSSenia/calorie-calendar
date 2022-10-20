import { CalendarService } from "./calendar.service"

describe('CalendarService', () => {
    const service = new CalendarService();
    it('should format date to YYYY-MM-DD format', () => {
        expect(service.formatDate(new Date(0))).toBe('1970-1-1');
    })
    it('should calculate REE', () => {
        expect(service.calculateREE(76, 196, 'Male')).toBe(1885.92);
    })
    it('should set and get meal from localstorage', () => {
        const meal: any = {
            title: "test",
            kcal: 4,
            fats: 3,
            proteins: 2,
            carbohydrates: 1
        }
        const date: Date = new Date(0);
        const hour: number = 0;
        service.setMeal(meal, date, hour);
        const gettedMeal: any = service.getMeal(date, hour);
        for (let i in meal) {
            expect(meal[i]).toBe(gettedMeal[i]);
        }
    })
})