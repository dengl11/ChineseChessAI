
import { Agent } from '../Agent/Agent'
import { State } from '../State/State'

export class MCTS_State extends State {
    sum_score = 0;
    visits = 0;
    parent: MCTS_State;
    children: MCTS_State[];


    // constructor(redAgent: Agent, blacAgent: Agent, playingTeam = 1) {
    //     super(redAgent, blacAgent, playingTeam)
    // }

    convert_from_state(state: State) {
        return new MCTS_State(state.redAgent, state.blackAgent, state.playingTeam);
    }

    get_ave_score() {
        if (this.visits == 0) return 0;
        return this.sum_score / this.visits;
    }

    add_score(x) { this.sum_score += x; }
    add_visit() { this.visits += 1; }

    set_parent(x) { this.parent = x; }



}
