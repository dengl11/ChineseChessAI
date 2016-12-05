import { Component, OnInit } from '@angular/core'
import { FormControl } from '@angular/forms';

@Component({
    selector: 'winRater',
    templateUrl: '../client/app/component_analysis/winRate.html',
    styleUrls: ['../client/app/component_analysis/winRate.css'],
})


export class WinRaterComponent implements OnInit {
    names = [
        'Greedy',
        'Alpha-Beta Pruning',
        'Alpha-Beta Pruning with Move Reorder',
        'Temporal Difference Learning',
        'Temporal Difference Learning (Trained)',
        'Monte Carlo Tree Search',
        'Ultimate (Combined Strategy)'
    ]


    N = 10;
    public team = 1;
    data_input;
    agent_param;
    humanMode;
    ngOnInit() {

    }

    public chartData: Array<any> = [];
    public chartLabels: Array<any> = [];

    swithTeam() {
        this.team *= -1;
        this.update(this.data_input, this.humanMode, this.agent_param);
    }

    update(r, humanMode, agent_param) {
        if (r.length == 0) {
            this.chartData = [];
            return;
        }
        this.data_input = r;
        this.agent_param = agent_param;
        this.humanMode = humanMode;
        r = this.pre_process(r);
        // no draw
        var x = r.filter(x => x != 0);
        var ave_win = this.process_results_ave(x);
        var accu_win = this.process_results_accu(x);
        // include draw
        var ave_win_draw = this.process_results_ave(r);
        var accu_win_draw = this.process_results_accu(r);
        this.chartData[0] = { data: ave_win.concat([0, 1]), label: "Average Winning Rate" };
        this.chartData[1] = { data: accu_win.concat([0, 1]), label: "Current Wiining Rate" };
        this.chartData[2] = { data: ave_win_draw.concat([0, 1]), label: "Average Win+Draw Rate" };
        this.chartData[3] = { data: accu_win_draw.concat([0, 1]), label: "Current Wii+Draw Rate" };
        var n = ave_win.length;
        var interval: number = Math.ceil(x.length / this.N);
        // console.log(data)
        // labels
        this.chartLabels = [];
        for (var i = 0; i < n; i += 1) {
            this.chartLabels.push("Game " + (i * interval));
        }
        // console.log("labels: ", this.lineChartLabels);
    }

    // results: [1|0|-1]
    // return: [win rate]
    process_results_ave(results) {
        var rate = [];
        var interval: number = Math.ceil(results.length / this.N);
        // console.log("interval:", interval);
        for (var i = 0; i < results.length; i += interval) {
            var period = results.slice(0, i + interval);
            var wins = period.filter(x => x >= 0);
            // console.log("period:", period)
            // console.log("wins:", wins)
            rate.push(wins.length / period.length);
        }
        return rate;
    }
    process_results_accu(results) {
        var rate = [];
        var interval: number = Math.ceil(results.length / this.N);
        // console.log("interval:", interval);
        for (var i = 0; i < results.length; i += interval) {
            var period = results.slice(i, i + interval);
            var wins = period.filter(x => x >= 0);
            // console.log("period:", period)
            // console.log("wins:", wins)
            rate.push(wins.length / period.length);
        }
        return rate;
    }

    teamControl: FormControl = new FormControl();

    pre_process(arr) {
        if (this.team == 1) return arr;
        return arr.map(x => x *= -1);
    }

    get_plot_title() {
        var red;
        // console.log(this.agent_param)
        if (!this.humanMode) red = this.names[this.agent_param[0]] + "-Depth " + this.agent_param[1];
        else red = "You ";
        var black = this.names[this.agent_param[2]] + "-Depth " + this.agent_param[3];
        var first = this.team == 1 ? red : black;
        var second = this.team == 1 ? black : red;
        return first + "( vs " + second + " )" + " Win Rate";
    }

}
