import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { WinRaterComponent } from '../component_analysis/winRate';
import { RuntimeAnalysist } from '../component_analysis/runtimeAnalysist';

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

    @ViewChild(RuntimeAnalysist)
    private runtimeAnalysist: RuntimeAnalysist;

    ngOnInit() {
    }

    humanMode: FormControl = new FormControl();

    selectOpponent(v) {
        // console.log(v);
    }
    // update analysis results
    update_result(x, agent_param) {
        this.winRaterComp.update(x, agent_param);
    }

    update_runtime(x) {
        this.runtimeAnalysist.update(x);
    }



}
