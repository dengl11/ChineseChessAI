import { Agent } from '../Agent/Agent'

export class GreedyAgent extends Agent {

    strategy = 0;
    DEPTH = 1;

    // private method of computing next move
    comptuteNextMove(state) {
        this.updateState();
        return this.greedy_move();
    }



    static copyFromDict(dict) {
        return new GreedyAgent(dict.team, this.piecesFromDict(dict.myPieces));
    }

}
