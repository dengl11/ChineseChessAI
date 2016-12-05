
import { Agent } from '../Agent/Agent'
import { State } from '../State/State'
import { Evaluation } from '../_Param/Evaluation'

export class EvalFnAgent extends Agent {

    DEPTH = 2;
    strategy = 1;

    constructor(team: number, depth = 2, myPieces = null, pastMoves = []) {
        // console.log("EvalFnAgent")
        super(team, myPieces, pastMoves);
        this.DEPTH = depth;
    }

    // return a copy of an agent
    copy() {
        return new EvalFnAgent(this.team, this.DEPTH, this.myPieces.map(x => x.copy()), this.copyMoves());
    }




}
