
import { Agent } from '../Agent/Agent'
import { State } from '../State/State'
import { StateFeatureExtractor } from '../State/StateFeatureExtractor'
import { Evaluation } from '../_Param/Evaluation'
import { TDLearner } from './TDLearner'
import { Reorder } from '../Reorder/Reorder'

export class TDLearnerTrained extends TDLearner {
    strategy = 4;
    weights = [20, 15, 30, 7, 20, 0, 20];

    //
    // static copyFromDict(dict) {
    //     return new TDLearnerTrained(dict.team, this.piecesFromDict(dict.myPieces), dict.DEPTH, this.weights);
    // }


}
