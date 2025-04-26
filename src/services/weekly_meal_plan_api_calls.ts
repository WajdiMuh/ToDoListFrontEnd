import { map, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { MealPlan } from '../interfaces/MealPlan';
import { format, set, toDate } from 'date-fns';
import { environment } from '../environments/environment';
import { io, Socket } from 'socket.io-client';

@Injectable({providedIn: 'root'})
export class weekly_meal_plan_api_calls {
    private socket: Socket;
    constructor(){
        this.socket = io(environment.backendURL + '/meal', {
            autoConnect: false
        });
    }

    connectToMealSocket()
    {
        if(this.socket.connected)
        {
            this.socket.disconnect();
        }
        this.socket.connect();
    }

    disconnectFromMealSocket()
    {
        this.socket.disconnect();
    }

    addMeal(new_meal_plan: MealPlan){
        var meal_plan_formatted:any = new_meal_plan;
        meal_plan_formatted["mealDate"] = format(new_meal_plan.mealDate, 'yyyy-MM-dd');
        this.socket.emit('add', meal_plan_formatted)
    }

    getMealsInWeek(year: number, calender_week: number): Observable<MealPlan[]>
    {
        this.socket.offAny();

        this.socket.emit('getMealsInWeek', {
            "year": year,
            "calenderWeek": calender_week
        });

        return new Observable<MealPlan[]>((observer) => {
            this.socket.on(`getMealsInWeek/year/${year}/calenderWeek/${calender_week}`, (data: MealPlan[]) => {
                data.forEach((item) => item.mealDate = set(toDate(item.mealDate), { hours: 0 }));
                observer.next(data);
            });
    
            // Handle cleanup
            return () => {
            this.socket.off(`getMealsInWeek/year/${year}/calenderWeek/${calender_week}`);
            };
        });
    }

    deleteMeal(id:number){
        this.socket.emit('delete', id);
    }

}
