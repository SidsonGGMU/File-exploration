import { Component } from '@angular/core';
import { IpcRenderer } from 'electron';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private ipc: IpcRenderer;
  folder: string;
  title = 'electron-angular-file-exploration';

  constructor() {
    if ((<any>window).require) {
      try {
        this.ipc = (<any>window).require('electron').ipcRenderer;
      } catch (e) {
        throw e;
      }
    } else {
      console.warn('App not running inside Electron!');
    }
  }

  checkConnection() {
    console.log("1-From Angular");
    this.ipc.send("checkConnection");
    this.ipc.on("reply", (event, arg) => {
      console.log(arg);
    })
  }

  browseDirectory() {
    this.ipc.send("browseDirectory");
    this.ipc.on("reply", (event, arg) => {
      console.log(arg);
    })
    this.ipc.removeListener("reply", ()=>{});
  }
}