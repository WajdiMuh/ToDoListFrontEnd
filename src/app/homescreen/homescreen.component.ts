import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectionList, MatListModule} from '@angular/material/list';
import { MatCardModule } from '@angular/material/card'
import { MatMenuModule } from '@angular/material/menu'

import { MatCheckboxModule } from '@angular/material/checkbox'
import { SideNavMenuItem } from '../enums/SideNavMenuItem';
import { ShoppinglistComponent } from '../../components/shoppinglist/shoppinglist.component';
import { WeeklyMealPlanComponent } from '../../components/weeklymealplan/weeklymealplan.component';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-homescreen',
  standalone: true,
  imports: [
    MatMenuModule,
    MatListModule,
    FormsModule,
    CommonModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatSelectionList, 
    MatCardModule,
    MatCheckboxModule,
    ShoppinglistComponent,
    WeeklyMealPlanComponent
  ],
  templateUrl: './homescreen.component.html',
  styleUrl: './homescreen.component.css',
})
export class HomescreenComponent {
  SideNavMenuItem = SideNavMenuItem;
  selected_menu_item: SideNavMenuItem = SideNavMenuItem.Shopping_List;
  side_item_subscription?: Subscription = undefined;
  constructor(private route: ActivatedRoute){};

  ngOnInit() {
    this.route.data.subscribe(data => {
      console.log(data);
      this.selected_menu_item = data["side_item"];
    });
    console.log(SideNavMenuItem);
  }

  ngOnDestroy() {
    if(this.side_item_subscription == undefined)
    {
      return;
    }

    this.side_item_subscription?.unsubscribe();
  }

  side_nav_item_click(side_nav_item: SideNavMenuItem)
  {
    console.log(side_nav_item);
    this.selected_menu_item = side_nav_item;
  }
}
