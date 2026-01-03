import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  private _title = signal('Dashboard');
  private _subTitle = signal('Vehicle Repair System');

  title() {
    return this._title;
  }

  subTitle() {
    return this._subTitle;
  }

  setTitle(title: string) {
    this._title.set(title);
  }

  setSubTitle(subTitle: string) {
    this._subTitle.set(subTitle);
  }
}
