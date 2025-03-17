import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'angular-calendar';
import { Subject } from 'rxjs';
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
import { parse, getDay, getWeek, GetWeekOptions, getYear } from 'date-fns';
import { weekly_meal_plan_api_calls } from '../../services/weekly_meal_plan_api_calls';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

const week_options:GetWeekOptions = {
  weekStartsOn: 1,
  firstWeekContainsDate: 4
}

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

  meal_plans: MealPlan[] = [];

  week_number: number = getWeek(this.viewDate, week_options);

  new_meal_strings: string[] = new Array(7).fill('');

  groupedColumns: string[] = ['grouped'];
  displayedColumns: string[] = ['date', 'name'];

  console = console;

  constructor(private spinner_service:SpinnerService, private apiCalls:weekly_meal_plan_api_calls, private route: ActivatedRoute, private router: Router,  private location: Location ) {}
  ngOnInit () {
    this.route.queryParams.subscribe(data => {
      if(Object.keys(data).length !== 0)
      {
        this.viewDate = parse(data["calender_week"], "I", new Date().setFullYear(data["year"]));
        this.week_number = getWeek(this.viewDate, week_options);
      }
    });
    setTimeout(() => {
      this.spinner_service.start_spinner();
      this.apiCalls.getMealsInWeek(getYear(this.viewDate), this.week_number).subscribe(meal_plans => {
        this.meal_plans = meal_plans;
        this.calendar_refresher.next();
        this.spinner_service.stop_spinner();
      });
    });
  }

  week_move_click(offset: number)
  {
    this.new_meal_strings = new Array(7).fill('');
    this.viewDate.setDate(this.viewDate.getDate() + offset);
    this.week_number = getWeek(this.viewDate, week_options);
    const urlTree = this.router.createUrlTree(
      ['/WeeklyMealPlan'], 
      {
        queryParams: {
          year: getYear(this.viewDate),
          calender_week: this.week_number
        },
        queryParamsHandling: 'merge'
      }
    );
    this.location.go(urlTree.toString());
    this.spinner_service.start_spinner();
    this.apiCalls.getMealsInWeek(getYear(this.viewDate), this.week_number).subscribe(meal_plans => {
      this.meal_plans = meal_plans;
      this.calendar_refresher.next();
      this.spinner_service.stop_spinner();
    });
  }

  delete_meal_plan(meal_plan: MealPlan)
  {
    this.spinner_service.start_spinner();
    this.apiCalls.deleteMeal(meal_plan.id).subscribe(() => {
      this.meal_plans.splice(this.meal_plans.indexOf(meal_plan), 1);
      this.spinner_service.stop_spinner();
    });
    let day = getDay(meal_plan.mealDate);
    this.new_meal_strings = this.new_meal_strings.fill('', day, day + 1);
  }

  add_meal_plan(meal_date:WeekDay)
  {
    this.spinner_service.start_spinner();

    let new_meal_plan:MealPlan = {
      id: 0,
      label: this.new_meal_strings[meal_date.day],
      mealDate: meal_date.date
    };

    this.apiCalls.addMeal(new_meal_plan).subscribe(() => {
      this.apiCalls.getMealsInWeek(getYear(this.viewDate), this.week_number).subscribe(meal_plans => {
        this.meal_plans = meal_plans;
        this.calendar_refresher.next();
        this.spinner_service.stop_spinner();
      });
      }
    );

  }

}

