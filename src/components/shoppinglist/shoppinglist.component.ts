import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {Item} from './../../interfaces/Item';
import { ApiCalls } from '../../services/apiCalls';
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
  ],
  templateUrl: './shoppinglist.component.html',
  styleUrl: './shoppinglist.component.css',
})

export class ShoppinglistComponent {
  StoreType = StoreType;
  stores: Store[] = [
    {name: "Miscellaneous", type: StoreType.Miscellaneous, items: []},
  ];
  constructor(
    private apiCalls:ApiCalls,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ){
    for(let [store_type, store_type_url] of StoreTypeIcon){
      this.matIconRegistry.addSvgIcon(
        StoreType[store_type],
        this.domSanitizer.bypassSecurityTrustResourceUrl(store_type_url)
      );
    }
  };

  ngOnInit () {
    this.apiCalls.fetchItems().subscribe(obj => {
      let items:Item[] = <Item[]>obj;
      this.stores[0].items = items;
    });
  }

  saveCheckedValue(event: MatSelectionListChange, store: Store){
    let id = event.options[0].value;
    let item: Item = store.items.find(e=> e.id ==id)!;

    item.checked = event.options[0].selected;
    this.apiCalls.updateCheckedValue(id, item.checked).subscribe();
  }

  deleteCheckedItems()
  {
    var checkedIDs:number[] = [];

    for(var store of this.stores)
    {
      checkedIDs = checkedIDs.concat(store.items.filter(e => e.checked).map(({ id }) => id));
    }

    this.apiCalls.deleteItems(checkedIDs).subscribe(() => {
      for(var store of this.stores)
      {
        store.items = store.items.filter(e => !e.checked);
      }
    })
  }

  store_checkbox_click(checked: boolean, store:Store)
  {
    for(var item of store.items)
    {
      item.checked = checked;
      this.apiCalls.updateCheckedValue(item.id, item.checked).subscribe();
    }
  }

  add_item_click(store:Store)
  {
    if((store.new_item == undefined) ||  (store.new_item == ""))
    {
      return;
    }
      
    this.apiCalls.saveItems(store.new_item, false).subscribe(() => {
        this.apiCalls.fetchItems().subscribe(obj => {
          let items:Item[] = <Item[]>obj;
          this.stores[0].items = items;
        });
      }
    );

    store.new_item = undefined;
  }
}
