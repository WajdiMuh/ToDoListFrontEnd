import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarEvent, CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { of, Subject } from 'rxjs';
import {MealPlan} from './../../interfaces/MealPlan';
import { NgArrayPipesModule } from 'ngx-pipes';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import { SpinnerService } from '../../services/spinner.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { WeekDay } from 'calendar-utils';
import { getDay, getWeek } from 'date-fns';

@Component({
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    CalendarModule,
    NgArrayPipesModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule, 
    MatInputModule, 
    FormsModule,
  ],
  selector: 'app-eventcalendar',
  styleUrl: './weeklymealplan.component.css',
  templateUrl: './weeklymealplan.component.html',
})
export class WeeklyMealPlanComponent {
  viewDate: Date = new Date();
  calendar_refresher = new Subject<void>();
  meal_plans: MealPlan[] = [
    {name: "meal 2", date: new Date(Date.now())},
  ];

  week_number: number = getWeek(this.viewDate);

  new_meal_strings: string[] = new Array(7).fill('');

  groupedColumns: string[] = ['grouped'];
  displayedColumns: string[] = ['date', 'name'];

  constructor(private spinner_service:SpinnerService) {
    this.spinner_service.stop_spinner();
  }

  week_move_click(offset: number)
  {
    this.new_meal_strings = new Array(7).fill('');
    this.viewDate.setDate(this.viewDate.getDate() + offset);
    this.week_number = getWeek(this.viewDate);
    this.calendar_refresher.next();
  }

  delete_meal_plan(meal_plan: MealPlan)
  {
    this.meal_plans.splice(this.meal_plans.indexOf(meal_plan), 1);
    let day = getDay(meal_plan.date);
    this.new_meal_strings = this.new_meal_strings.fill('', day, day + 1);
  }

  add_meal_plan(meal_date:WeekDay)
  {
    this.meal_plans.push({name: this.new_meal_strings[meal_date.day], date: meal_date.date})
  }

}

