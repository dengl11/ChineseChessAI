
import { Agent } from '../Agent/Agent'
import { State } from '../State/State'
import { TDLeaner } from '../TDLearner/TDLearner'
import { MoveReorderPruner } from '../MoveReorderPruner/MoveReorderPruner'

export class MCTS extends TDLeaner {

    weights = [20, 15, 30, 7, 20, 0, 20];

    strategy = 5;
    copy() {
        return new MCTS(this.team, this.DEPTH, this.weights, this.myPieces.map(x => x.copy()), this.copyMoves());
    }

    update_weights() {
        return this.weights;
    }
}
