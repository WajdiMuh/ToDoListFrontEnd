import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectionList, MatListModule, MatSelectionListChange} from '@angular/material/list';
import { MatCardModule } from '@angular/material/card'
import { MatMenuModule } from '@angular/material/menu'

import { MatCheckboxModule } from '@angular/material/checkbox'

import {Item} from './../../interfaces/Item';
import { ApiCalls } from '../../services/apiCalls';

@Component({
  selector: 'app-homescreen',
  standalone: true,
  imports: [MatMenuModule,MatListModule,FormsModule,CommonModule,MatButtonModule,MatToolbarModule,MatIconModule,MatSidenavModule,MatSelectionList, MatCardModule,MatCheckboxModule],
  templateUrl: './homescreen.component.html',
  styleUrl: './homescreen.component.css'
})
export class HomescreenComponent {
  items:Item[] = [];
  labels: string[] = [];

  newItem : string = '';
  id:number = 0;
  itemList: Object;
  checkedItemIds: number[] = [];
  constructor(private apiCalls:ApiCalls){};

  ngOnInit () {
    this.apiCalls.fetchItems().subscribe(obj => {
      let items:Item[] = <Item[]>obj;
      this.items = this.items.concat(items);
      this.checkedItemIds.push(...(items.filter(e => e.checked)).map(({ id }) => id));
      console.log(this.checkedItemIds);
    });
    
  }

  addItem()
  {
    if(this.newItem == "")
    {
      return;
    }
    
    this.apiCalls.saveItems(this.newItem, false).subscribe(
      () => {
        this.apiCalls.fetchItems().subscribe(obj => {
          let items:Item[] = <Item[]>obj;
          this.items = items;
          this.checkedItemIds.push(...(items.filter(e => e.checked)).map(({ id }) => id));
          console.log(this.checkedItemIds);
        });
      }
    );
    for(let item of this.items) {
      this.labels.push(item.label);
    }


    this.items.push({id : this.id++, label: this.newItem, checked: false});
    this.newItem = '';
  }


  saveCheckedValue(event: MatSelectionListChange){
    let id = event.options[0].value;
    let item: Item = this.items.find(e=> e.id ==id)!;

    item.checked = event.options[0].selected;
    this.apiCalls.updateCheckedValue(id, item.checked).subscribe();
    if (item.checked) {
      if (!this.checkedItemIds.includes(id)) {
        this.checkedItemIds.push(id);
      }
    } else {

      const index = this.checkedItemIds.indexOf(id);
      if (index !== -1) {
        this.checkedItemIds.splice(index, 1);
      }
    } 
    console.log(this.checkedItemIds);
  }

  deleteCheckedItems()
  {
    console.log("hi");
    this.apiCalls.deleteItems(this.checkedItemIds).subscribe(obj => {
    this.items = this.items.filter(e => !e.checked);
    console.log(this.items.filter(e => !e.checked));})
  }

}
