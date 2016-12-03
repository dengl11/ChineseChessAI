
import { Agent } from '../Agent/Agent'
import { State } from '../State/State'
import { EvalFnAgent } from '../EvalFn/EvaluationFn'
import { Evaluation } from '../_Param/Evaluation'

export class MoveReorderPruner extends EvalFnAgent {

    strategy = 2

    constructor(team: number, depth = 2, myPieces = undefined, pastMoves = []) {
        super(team, depth, myPieces, pastMoves);
        this.DEPTH = depth;
    }

    copy() {
        return new MoveReorderPruner(this.team, this.DEPTH, this.myPieces.map(x => x.copy()), this.copyMoves());
    }


}
