
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  selector: 'app-eventcalendar',
  styleUrl: './weeklymealplan.component.css',
  templateUrl: './weeklymealplan.component.html',
})
export class WeeklyMealPlanComponent {
  
  constructor() {}

}

