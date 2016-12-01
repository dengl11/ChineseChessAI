
import { Agent } from '../Agent/Agent'
import { State } from '../State/State'
import { EvalFnAgent } from '../EvalFn/EvaluationFn'
import { Evaluation } from '../_Param/Evaluation'

export class TDLeaner extends EvalFnAgent {

    constructor(team: number, depth = 2, myPieces = undefined, pastMoves = []) {
        super(team, depth, myPieces, pastMoves);
        this.strategy = 5;
    }

    copy() {
        var copy_mypieces = [];
        for (var i in this.myPieces) {
            copy_mypieces.push(this.myPieces[i].copy());
        }
        return new TDLeaner(this.team, this.DEPTH, copy_mypieces, this.copyMoves());
    }

}
