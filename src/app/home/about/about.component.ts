import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $(document).ready(function () {
      $('button').click(function () {
        const div = $('#Joe');
        div.animate({ left: '100px' }, 'slow');
        div.animate({ fontSize: '5em' }, 'slow');
      });
    });
  }

}
