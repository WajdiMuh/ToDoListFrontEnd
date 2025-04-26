import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Item } from '../interfaces/Item';
import { environment } from '../environments/environment';
import { Store } from '../interfaces/Store';
import { io, Socket } from 'socket.io-client';

@Injectable({providedIn: 'root'})
export class shopping_list_api_calls {
    private socket: Socket;
    constructor(){
        this.socket = io(environment.backendURL + '/store', {
            autoConnect: false
        });
    }

    connectToStoreSocket()
    {
        if(this.socket.connected)
        {
            this.socket.disconnect();
        }
        this.socket.connect();
    }

    disconnectFromStoreSocket()
    {
        this.socket.disconnect();
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
