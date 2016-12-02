import { Component, OnInit } from '@angular/core'


@Component({
    selector: 'winRater',
    templateUrl: '../client/app/component_analysis/winRate.html',
    styleUrls: ['../client/app/component_analysis/winRate.css'],
})


export class WinRaterComponent implements OnInit {

    ngOnInit() {

    }

    // lineChart
    public lineChartData: Array<any> = [
        [28, 48, 40, 19, 86, 27, 90]
    ];
    public lineChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    public lineChartType: string = 'line';


    update() {
        this.lineChartData[0] = [0.1, 0.2];
    }
}
