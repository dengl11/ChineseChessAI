
import { Agent } from '../Agent/Agent'
import { State } from '../State/State'
import { TDLearner } from '../TDLearner/TDLearner'
import { MoveReorderPruner } from '../MoveReorderPruner/MoveReorderPruner'

export class MCTS extends Agent {


    strategy = 5;
    N_SIMULATION;
    copy() {
        return new MCTS(this.team, this.N_SIMULATION, this.myPieces.map(x => x.copy()), this.pastMoves);
    }

    constructor(team: number, N, myPieces = undefined, pastMoves = []) {
        super(team, myPieces, pastMoves);
        this.N_SIMULATION = N;
    }
}
