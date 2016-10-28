import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app',
  templateUrl: '../client/app/component_main/app.component.main.html',
  styleUrls: ['../client/app/component_main//app.component.main.css']
})


export class AppComponent implements OnInit {

  logined = false;
  options: any;

  ngOnInit() {
  }
  


}
