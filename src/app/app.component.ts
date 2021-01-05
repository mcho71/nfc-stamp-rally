import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

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

const NFCCardSerialNumberStampNameMap = new Map<string, typeof STAMPS[number]['name']>([
  [environment.serialNumbers[0], 'head'],
  [environment.serialNumbers[1], 'neck'],
  [environment.serialNumbers[2], 'leg']
]);

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
  scanning = false;
  ndef?: NDEFReader;

  resetStamp() {
    if (!confirm('本当に最初から始める？')) return;
    for (const stamp of this.stamps) {
      stamp.correct = false;
    }
  }

  async start() {
    if (!this.scanning && !await this.startScan()) {
      return;
    }
    try {
      let errorCount = 0;
      this.ndef!.addEventListener("error", () => {
        // WebNFC非対応のNFCのカードでも動くように、エラー内でもスタンプを押す処理を行っている
        if (errorCount >= this.stamps.length) {
          return;
        }
        this.stamps[errorCount].correct = true;
        errorCount++;
      });
      // @ts-ignore
      this.ndef!.addEventListener("reading", ({ serialNumber }) => {
        const stampName = NFCCardSerialNumberStampNameMap.get(serialNumber);
        // @ts-ignore
        const stamp = this.stamps.find(stamp => stamp.name === stampName);
        if (stamp) {
          stamp.correct = true;
        }
      });
    } catch (error) {
      alert(`読み取りエラー: ${error}`);
    }
  }

  async startScan() {
    if (!('NDEFReader' in window)) {
      alert('Web NFCを有効にしてください。');
      return false;
    }

    this.ndef = new NDEFReader();
    await this.ndef.scan();
    this.scanning = true;
    return true;
  }
}
