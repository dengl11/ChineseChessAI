
import { Agent } from '../Agent/Agent'
import { State } from '../State/State'
import { EvalFnAgent } from '../EvalFn/EvaluationFn'
import { Evaluation } from '../_Param/Evaluation'

export class TDLearnerTrained extends EvalFnAgent {
    strategy = 4;

    copy() { return new TDLearnerTrained(this.team, this.DEPTH, this.myPieces.map(x => x.copy()), this.copyMoves()); }



}
