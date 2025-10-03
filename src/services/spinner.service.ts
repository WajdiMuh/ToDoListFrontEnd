import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  spinner_subject:Subject<Boolean> = new Subject();
  private timeoutId?: NodeJS.Timeout = undefined;

  constructor() { }

  stop_spinner()
  {
    this.clearTimeout();
    this.spinner_subject.next(false);
  }


  /**
   * Start the spinner with an optional timeout.
   *
   * @param timeout_callback - if not undefined will be called if a timeout occurs 
   * and stop spinner wasn't manually called.
   * 
   * @param timeout_value - value in milliseconds for the timeout duration
   * 0 or less means no timeout.
   * 
   * @return void
   */
  start_spinner(timeout_callback?:() => void, timeout_value:number = 0)
  {
    this.clearTimeout();
    this.spinner_subject.next(true);

    if(timeout_value <= 0)
    {
      return;
    }

    this.timeoutId = setTimeout(() => {
      this.stop_spinner();

      if(!timeout_callback)
      {
        return;
      }

      timeout_callback();

    }, timeout_value);
  }

  private clearTimeout() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
  }

}
