import { Component } from '@angular/core';
import { DefaultUser } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  defaultUser = DefaultUser;

  constructor() {}

}
