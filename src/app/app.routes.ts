import { Routes } from '@angular/router';
import { ShoppinglistComponent } from '../components/shoppinglist/shoppinglist.component';
import { HomescreenComponent } from './homescreen/homescreen.component';


export const routes: Routes = [
    { path: '**', component: HomescreenComponent }
];
 

