import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SiblingCommunicationService {
  // Observable to trigger actions
  private triggerActionSource = new Subject<string>();

  // Expose as Observable
  triggerAction$ = this.triggerActionSource.asObservable();

  // Method for one sibling to trigger
  trigger(action: string) {
    this.triggerActionSource.next(action);
  }
}
