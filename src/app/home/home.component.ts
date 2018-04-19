import { Component, OnInit } from '@angular/core';
import { User } from './common/model.model';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  showAlert = true;
  elems = {
    home: true,
    register: false,
    about: false
  };
  token = null;
  message = new User();

  constructor() { }



  receiveMessage($event) {
    this.open('about');
  }

  ngOnInit() {
  }

  open(e) {
    for (const key in this.elems) {
      if (this.elems.hasOwnProperty(key)) {
        this.elems[key] = false;
      }
    }
    this.elems[e] = true;
  }
  public closeAlert(alert) {
    this.showAlert = false;
  }

}
