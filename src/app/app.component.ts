import { Component } from '@angular/core';

const STAMPS = [
  {
    name: 'head',
    imagePath: 'assets/stamps/1.png'
  },
  {
    name: 'neck',
    imagePath: 'assets/stamps/2.png'
  },
  {
    name: 'leg',
    imagePath: 'assets/stamps/3.png'
  }
] as const;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'nfc-stamp-rally';
  stamps = STAMPS.map(stamp => {
    return {
      ...stamp,
      correct: false
    }
  });

  constructor() {
    this.stamps[0].correct = true;
    this.stamps[2].correct = true;
  }
}
