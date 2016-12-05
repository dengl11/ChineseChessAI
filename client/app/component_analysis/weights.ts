import { Component, OnInit, Input } from '@angular/core'
import { FormControl } from '@angular/forms';

@Component({
    selector: 'weightTable',
    templateUrl: '../client/app/component_analysis/weights.html',
    styleUrls: ['../client/app/component_analysis/weights.css', '../client/app/component_analysis/winRate.css'],
})


export class WeightTableComponent {

    weight_record_1 = []; // [[weight]]
    weight_record_2 = []; // [[weight]]
    N = 3;
    @Input() depth1;
    @Input() depth2;

    update(w1, w2) {
        if (!w1) this.weight_record_1 = [];
        else this.weight_record_1.push(w1);
        this.weight_record_1 = this.weight_record_1.slice(0, this.N);

        if (!w2) this.weight_record_2 = [];
        else this.weight_record_2.push(w2);
        this.weight_record_2 = this.weight_record_2.slice(0, this.N);
    }

}
