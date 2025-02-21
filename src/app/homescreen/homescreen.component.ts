import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectionList, MatListModule} from '@angular/material/list';
import { MatCardModule } from '@angular/material/card'
import { MatMenuModule } from '@angular/material/menu'

import { MatCheckboxModule } from '@angular/material/checkbox'
import { SideNavMenuItem } from '../enums/SideNavMenuItem';
import { ShoppinglistComponent } from '../../components/shoppinglist/shoppinglist.component';
import { WeeklyMealPlanComponent } from '../../components/weeklymealplan/weeklymealplan.component';
import { ActivatedRoute, NavigationStart, ParamMap, Route, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { routes } from '../app.routes';
import { Location } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { SpinnerService } from '../../services/spinner.service';

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
    WeeklyMealPlanComponent,
    MatProgressSpinnerModule
  ],
  templateUrl: './homescreen.component.html',
  styleUrl: './homescreen.component.css',
})
export class HomescreenComponent {
  SideNavMenuItem = SideNavMenuItem;
  selected_menu_item: SideNavMenuItem = SideNavMenuItem.Shopping_List;
  side_item_subscription?: Subscription = undefined;
  @ViewChild('sidenav') side_nav: MatSidenav;
  spinner_state: Boolean = false;
  constructor(private route: ActivatedRoute, private location: Location, private router: Router, private spinner_service:SpinnerService){};

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.selected_menu_item = data["side_item"];
    });
    this.router.events.subscribe(() => {
        window.location.reload();
    });

    this.spinner_service.spinner_subject.subscribe(state => {
      this.spinner_state = state;
    });
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
    this.side_nav.close();
    let route:Route = routes.find(route => route.data!["side_item"] == side_nav_item)!;
    this.location.go(route.path!);
    this.selected_menu_item = side_nav_item;
  }
}
