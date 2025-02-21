import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  spinner_subject:Subject<Boolean> = new Subject();
  
  constructor() { }

  stop_spinner()
  {
    this.spinner_subject.next(false);
  }

  start_spinner()
  {
    this.spinner_subject.next(true);
  }

}
