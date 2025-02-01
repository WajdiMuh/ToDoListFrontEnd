import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Item} from './../interfaces/Item';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class ApiCalls {

backendURL ="https://todolist.ddnsfree.com";

constructor(private http: HttpClient){}

fetchItems():  Observable<Object> {

    return this.http.get(this.backendURL + '/item/fetch')
     
}

saveItems(label:string, checked:boolean): Observable<Object>{
    return this.http.post(this.backendURL + '/item/add', null, {
        params: {checked:checked,label:label}
    });

}

deleteItems(ids:number[]) : Observable<Object> {
    return this.http.post(this.backendURL + '/item/delete', null, {
        params: {itemIDs: ids}
    });
}

updateCheckedValue(id: number, checked: boolean) :Observable<Object> {
    return this.http.post(this.backendURL + '/item/update', null, {
        params: {checked: checked, id: id}
    });
}
}


//