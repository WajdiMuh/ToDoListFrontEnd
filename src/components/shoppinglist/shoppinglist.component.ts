import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {Item} from './../../interfaces/Item';
import { ApiCalls } from '../../services/apiCalls';

@Component({
  selector: 'app-shoppinglist',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './shoppinglist.component.html',
  styleUrl: './shoppinglist.component.css',
})

export class ShoppinglistComponent {
  items:Item[] = [];
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

    this.items.push({id : this.id++, label: this.newItem, checked: false});
    this.newItem = '';
  }


  saveCheckedValue(event: any, id: number){
    let item: Item = this.items.find(e=> e.id ==id)!;
    item.checked = event.target.checked;
    this.apiCalls.updateCheckedValue(id, item.checked).subscribe();

    if(item.checked == true) {
    this.checkedItemIds.push(id);
    }
    else {
      this.checkedItemIds.splice(this.checkedItemIds.indexOf(id),1);
    }
    console.log(this.checkedItemIds);

   
  }

  deleteCheckedItems()
  {
    this.apiCalls.deleteItems(this.checkedItemIds).subscribe(obj => {
    this.items = this.items.filter(e => !e.checked);
    console.log(this.items.filter(e => !e.checked));})
  }
}





//why does it change the order in an odd way?