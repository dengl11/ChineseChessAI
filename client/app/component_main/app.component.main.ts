import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { WinRaterComponent } from '../component_analysis/winRate';

@Component({
    selector: 'app',
    templateUrl: '../client/app/component_main/app.component.main.html',
    styleUrls: ['../client/app/component_main//app.component.main.css']
})


export class AppComponent implements OnInit {

    logined = false;
    options: any;
    @ViewChild(WinRaterComponent)
    private winRaterComp: WinRaterComponent;
    ngOnInit() {
    }

    humanMode: FormControl = new FormControl();

    selectOpponent(v) {
        // console.log(v);
    }
    // update analysis results
    update_result(x) {
        this.winRaterComp.update(x);
    }



}
