import { Component, OnInit } from '@angular/core';

import { BoardComponent} from '../component_board/board';
import { MapToIterable} from '../pipe/MapToIterable';


@Component({
  selector: 'app',
  templateUrl: '../client/app/component_main/app.component.main.html',
  styleUrls: ['../client/app/component_main//app.component.main.css'],
  directives: [BoardComponent],
  pipes:[MapToIterable]
})

export class AppComponent implements OnInit {

  logined = false;
  options: any;

  ngOnInit() {
  }
  


}
