
import { Agent } from '../Agent/Agent'
import { State } from '../State/State'

export class MCTS_State {
    sum_score = 0;
    visits = 0;
    parent: MCTS_State;
    children: MCTS_State[];
    state: State;

    EXP_RATE = 12000;
    // EXP_RATE = 10000000;
    // [piece:Piece, toPos];
    parentMove;

    constructor(state, move) { this.state = state; this.parentMove = move; }
    get_ave_score() {
        return this.sum_score / this.visits;
    }

    UCB_valule() {
        var n = this.parent.visits;
        var visits = this.visits;
        var ave = this.get_ave_score();
        // console.log("ave:", ave)
        // console.log("visits:", visits)
        // console.log("n:", n)
        // console.log("Math.sqrt(2 * Math.log(n) / visits):", Math.sqrt(2 * Math.log(n) / visits))
        return ave + Math.sqrt(this.EXP_RATE * Math.log(n) / visits);
    }

    depth() {
        var r = 0;
        var temp = this.parent;
        while (temp) {
            temp = temp.parent;
            r += 1;
        }
        return r;
    }


    add_score(x) { this.sum_score += x; }
    add_visit() { this.visits += 1; }

    set_parent(x) { this.parent = x; }

    generate_children() {
        this.children = [];
        var playing_agent = this.state.get_playing_agent();
        playing_agent.updateBoardState();
        // var endState = this.state.getEndState();
        // if (endState != 0) {
        //     var depth = this.depth();
        //     var sameAsRoot = (depth % 2 == 0 ? 1 : -1);
        //     this.sum_score = sameAsRoot * this.state.playingTeam * endState * Infinity;
        //     console.log("END: ", this.sum_score)
        //     return;
        // }
        playing_agent.computeLegalMoves();
        var moves = playing_agent.get_moves_arr();
        // console.log(moves, moves.length)
        for (var i in moves) {
            var movePieceName = moves[i][0];
            var move = moves[i][1];
            var nextState = this.state.next_state(movePieceName, move);
            var child = new MCTS_State(nextState, [playing_agent.getPieceByName(movePieceName), move]);
            child.set_parent(this);
            this.children.push(child);
        }
    }
}
