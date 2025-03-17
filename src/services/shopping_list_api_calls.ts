import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Item } from '../interfaces/Item';
import { environment } from '../environments/environment';
import { Store } from '../interfaces/Store';

@Injectable({providedIn: 'root'})
export class shopping_list_api_calls {

    constructor(private http: HttpClient){}

    fetchStores(): Observable<Store[]>
    {
        return this.http.get<Store[]>(environment.backendURL + '/store/fetch')
    }

    saveItems(new_item: Item): Observable<Object>{
        return this.http.post(environment.backendURL+ '/item/add', new_item);
    }

    deleteItems(ids:number[]) : Observable<Object> {
        return this.http.delete(environment.backendURL+ '/item/delete', {
            body: ids
        });
    }

    updateCheckedValue(id_checked_map: Map<number, boolean>) :Observable<Object> {
        return this.http.put(environment.backendURL+ '/item/updateCheck', Object.fromEntries(id_checked_map));
    }

}
