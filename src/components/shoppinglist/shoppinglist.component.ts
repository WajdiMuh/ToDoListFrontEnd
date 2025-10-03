import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {Item} from './../../interfaces/Item';
import { shopping_list_api_calls } from '../../services/shopping_list_api_calls';
import { MatListModule, MatSelectionListChange } from '@angular/material/list';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { Store } from '../../interfaces/Store';
import { NgArrayPipesModule } from 'ngx-pipes';
import { MatIcon, MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { StoreType, StoreTypeIcon } from '../../app/enums/StoreType';
import { HttpClientModule } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { SpinnerService } from '../../services/spinner.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { Subscription } from 'rxjs';
import { SOCKET_TIMEOUT } from '../../services/socket_api_calls';

@Component({
  selector: 'app-shoppinglist',
  standalone: true,
  imports: [
    MatMenuModule,
    MatListModule,
    FormsModule,
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatExpansionModule,
    NgArrayPipesModule,
    MatIconModule,
    FormsModule, 
    MatFormFieldModule, 
    MatInputModule,
    MatAutocompleteModule,

  ],
  templateUrl: './shoppinglist.component.html',
  styleUrl: './shoppinglist.component.css',
})

export class ShoppinglistComponent {
  StoreType = StoreType;
  stores: Store[] = [];

  search_text: string = "";
  
  private socketSubscription: Subscription;

  constructor(
    private apiCalls:shopping_list_api_calls,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private spinner_service:SpinnerService
  ){
    for(let [store_type, store_type_url] of StoreTypeIcon){
      this.matIconRegistry.addSvgIcon(
        StoreType[store_type],
        this.domSanitizer.bypassSecurityTrustResourceUrl(store_type_url)
      );
    }
  };

  trackByStoreId = (index: number, store: Store) => store.id;
  trackByItemId = (index: number, item: Item) => item.id;

  ngOnInit () {
    setTimeout(() => {
      this.spinner_service.start_spinner(undefined, SOCKET_TIMEOUT);
      this.socketSubscription = this.apiCalls.fetchStores().subscribe(stores => {
        this.stores = stores;
        this.spinner_service.stop_spinner();
      });
      this.apiCalls.connect();
    });
  }

  ngOnDestroy() {
    if(this.socketSubscription != undefined)
    {
      this.socketSubscription.unsubscribe();
    }
    this.apiCalls.disconnect();
  }

  saveCheckedValue(event: MatSelectionListChange, store: Store){
    let id = event.options[0].value;
    let item: Item = store.items.find(e=> e.id ==id)!;

    item.checked = event.options[0].selected;
    let id_checked_map = new Map<number, boolean>([
      [id, item.checked],
    ]);
    this.spinner_service.start_spinner(undefined, SOCKET_TIMEOUT);
    this.apiCalls.updateCheckedValue(id_checked_map);
  }

  deleteCheckedItems()
  {
    var checkedIDs:number[] = [];

    for(var store of this.stores)
    {
      checkedIDs = checkedIDs.concat(store.items.filter(e => e.checked).map(({ id }) => id));
    }

    this.spinner_service.start_spinner(undefined, SOCKET_TIMEOUT);
    this.apiCalls.deleteItems(checkedIDs);
  }

  store_checkbox_click(checked: boolean, items:Item[])
  {

    var id_checked_map = new Map<number, boolean>();
    for(var item of items)
    {
      item.checked = checked;
      id_checked_map.set(item.id, checked);
    }

    this.spinner_service.start_spinner(undefined, SOCKET_TIMEOUT);
    this.apiCalls.updateCheckedValue(id_checked_map);
  }

  add_item_click(store:Store)
  {
    if((store.new_item == undefined) ||  (store.new_item == ""))
    {
      return;
    }
     
    this.spinner_service.start_spinner(undefined, SOCKET_TIMEOUT);

    let new_item:Item = {
      id: 0,
      label: store.new_item,
      checked: false,
      storeid: store.id
    };

    this.apiCalls.saveItems(new_item);

    store.new_item = undefined;
  }
}
