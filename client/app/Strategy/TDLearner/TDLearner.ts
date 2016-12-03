
import { Agent } from '../Agent/Agent'
import { State } from '../State/State'
import { EvalFnAgent } from '../EvalFn/EvaluationFn'
import { Evaluation } from '../_Param/Evaluation'

export class TDLeaner extends EvalFnAgent {
    strategy = 3;
    weights = [];
    INIT_WEIGHTS = [0, 0, 0, 0, 0, 0, 0];
    feature_matrix = []; //[fea_vec]

    constructor(team: number, depth = 2, myPieces = undefined, pastMoves = [], weights = null) {
        super(team, depth, myPieces, pastMoves);
        this.weights = weights ? weights : this.INIT_WEIGHTS;
    }

    copy() {
        var copy_mypieces = [];
        for (var i in this.myPieces) {
            copy_mypieces.push(this.myPieces[i].copy());
        }
        return new TDLeaner(this.team, this.DEPTH, copy_mypieces, this.copyMoves(), this.weights);
    }

    // result: 1-red win | -1:red lose
    update_weights(nSimulations, result) {
        result *= this.team;
        // consolidate features vectors throught whole game into one
        var accu_fea = this.feature_matrix.reduce((x, y) => ([x[0] + y[0], x[1] + y[1], x[2] + y[2], x[3] + y[3], x[4] + y[4]]));
        console.log("result:", result)
        console.log("accu_fea:", accu_fea)
        var eta = 1 / Math.sqrt(nSimulations); // learning rate
        var gradient = accu_fea.map(x => x * eta);
        console.log("gradient:", gradient)
        for (var i = 0; i < accu_fea.length; i++) this.weights[i] += gradient;
        return this.weights;
    }

    save_state(feature_vec) {
        // console.log("save_state: ", feature_vec, " | Current: ", this.feature_matrix)
        this.feature_matrix.push(feature_vec);
    }



}
