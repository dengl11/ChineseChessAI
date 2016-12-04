
import { Agent } from '../Agent/Agent'
import { State } from '../State/State'
import { StateFeatureExtractor } from '../State/StateFeatureExtractor'
import { EvalFnAgent } from '../EvalFn/EvaluationFn'
import { Evaluation } from '../_Param/Evaluation'
import { Reorder } from './Reorder'

export class ReorderTypeB extends Reorder {
    static copyFromDict(dict) {
        return new ReorderTypeB(dict.team, this.piecesFromDict(dict.myPieces), dict.DEPTH);
    }
}
