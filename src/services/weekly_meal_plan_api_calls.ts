import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Item } from '../interfaces/Item';
import { MealPlan } from '../interfaces/MealPlan';
import { format, set, toDate } from 'date-fns';
import { environment } from '../environments/environment';

@Injectable({providedIn: 'root'})
export class weekly_meal_plan_api_calls {

    constructor(private http: HttpClient){}

    addMeal(new_meal_plan: MealPlan): Observable<Object>{
        var meal_plan_formatted:any = new_meal_plan;
        meal_plan_formatted["mealDate"] = format(new_meal_plan.mealDate, 'yyyy-MM-dd');
        return this.http.post(environment.backendURL+ '/meal/add', meal_plan_formatted);
    }

    getMealsInWeek(year: number, calender_week: number): Observable<MealPlan[]>
    {
        return this.http.get<MealPlan[]>(environment.backendURL+ '/meal/getMealsInWeek', {
            params: {
                "year": year,
                "calenderWeek": calender_week
            }
        }).pipe(
            map((res:MealPlan[]) => {
                res.forEach((item) => item.mealDate = set(toDate(item.mealDate), { hours: 0 }));
                return res;
            })
        );
    }

    deleteMeal(id:number) : Observable<void> {
        return this.http.delete<void>(environment.backendURL+ '/meal/delete', {
            params: {
                "id": id
            }
        });
    }

}
