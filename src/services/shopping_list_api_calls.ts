import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Item } from '../interfaces/Item';
import { Store } from '../interfaces/Store';
import { socket_api_calls } from './socket_api_calls';

@Injectable({providedIn: 'root'})
export class shopping_list_api_calls extends socket_api_calls {
    constructor(){
        super('/store');
    }

    fetchStores(): Observable<Store[]> {
        return new Observable<Store[]>((observer) => {
          this.socket.on('fetch', (data: Store[]) => {
            observer.next(data);
          });
    
          // Handle cleanup
          return () => {
            this.socket.off('fetch');
          };
        });
    }

    saveItems(new_item: Item){
        this.socket.emit('item/add', new_item);
    }

    deleteItems(ids:number[]){
        this.socket.emit('item/delete', ids);
    }

    updateCheckedValue(id_checked_map: Map<number, boolean>){
        this.socket.emit('item/updateCheck', Object.fromEntries(id_checked_map));
    }

}
