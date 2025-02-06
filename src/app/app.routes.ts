import { Routes } from '@angular/router';
import { HomescreenComponent } from './homescreen/homescreen.component';
import { SideNavMenuItem } from './enums/SideNavMenuItem';

export const routes: Routes = [
    { path: 'WeeklyMealPlan', component: HomescreenComponent, data: {side_item: SideNavMenuItem.Weekly_Meal_Plan} },
    { path: 'ShoppingList', component: HomescreenComponent, data: {side_item: SideNavMenuItem.Shopping_List}},
    { path: '**', component: HomescreenComponent, data: {side_item: SideNavMenuItem.Shopping_List}},
];
