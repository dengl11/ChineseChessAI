
import { Agent } from '../Agent/Agent'
import { State } from '../State/State'
import { TDLeaner } from '../TDLearner/TDLearner'

export class MCTS extends TDLeaner {

    strategy = 5;
    copy() {
        return new MCTS(this.team, this.DEPTH, this.weights, this.myPieces.map(x => x.copy()), this.copyMoves());
    }
}
