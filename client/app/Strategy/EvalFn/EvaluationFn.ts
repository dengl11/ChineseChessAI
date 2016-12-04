
import { Agent } from '../Agent/Agent'
import { State } from '../State/State'
import { Evaluation } from '../_Param/Evaluation'

export class EvalFnAgent extends Agent {

    DEPTH = 2;
    strategy = 1;
    // private method of computing next move
    // return [piece, toPos];
    comptuteNextMove() {
        if (this.team == 1) var curr_state = new State(this, this.oppoAgent);
        else var curr_state = new State(this.oppoAgent, this, this.team);
        // console.log("curr_state:", curr_state)
        var evalResult = this.recurseEvaluation(curr_state, this.DEPTH, -Infinity, Infinity);
        // console.log("evalResult", evalResult)
        var movePiece = this.getPieceByName(evalResult[1][0]);
        // console.log("movePiece", movePiece)
        return [movePiece, evalResult[1][1]];
    }

    constructor(team: number, depth = 2, myPieces = null, pastMoves = []) {
        // console.log("EvalFnAgent")
        super(team, myPieces, pastMoves);
        this.DEPTH = depth;
    }




}
