
import { Agent } from '../Agent/Agent'
import { State } from '../State/State'
import { StateFeatureExtractor } from '../State/StateFeatureExtractor'
import { MCTS_State } from './MCTS_State'

export class MCTS extends Agent {

    strategy = 5;
    N_SIMULATION;

    constructor(team, pieces, N) {
        super(team, pieces);
        this.N_SIMULATION = N;
    }

    static copyFromDict(dict) {
        return new MCTS(dict.team, this.piecesFromDict(dict.myPieces), dict.N_SIMULATION);
    }


    // return [piece:Piece, toPos];
    comptuteNextMove(state) {
        var root = new MCTS_State(state, null);
        // console.log("root:", root.visits);
        var i_simulation = 1;
        while (i_simulation <= this.N_SIMULATION) {
            // console.log("======================", i_simulation, "======================")
            i_simulation += 1;
            var seleted_state: MCTS_State = this.select(root);
            var simulated_state = this.simulate(root, seleted_state);
            if (simulated_state) this.back_propagate(simulated_state);
        }
        var r = this.pick_max_UCB_child(root).parentMove;
        // console.log("======================MOVE: ", r, "======================")
        return r;
    }

    // select one child node to simulate
    // return null if end state
    select(mcts_state: MCTS_State) {
        // not visited before, need to generate child ndoes
        if (mcts_state.parent && mcts_state.visits == 0) {
            mcts_state.visits = 1;
            return mcts_state;
        }
        if (!mcts_state.children) mcts_state.generate_children();
        var unvisited = mcts_state.children.filter(x => x.visits == 0);
        if (unvisited.length > 0) return unvisited[0];
        var selected = this.pick_max_UCB_child(mcts_state);
        if (selected) return this.select(selected);
        else return mcts_state;
    }

    pick_max_UCB_child(mcts_state: MCTS_State) {
        var selected: MCTS_State = null;
        var max_value = -Infinity;
        for (var i in mcts_state.children) {
            var child = mcts_state.children[i];
            var v = child.UCB_valule();
            // console.log("ucb value:", v)
            if (v > max_value) {
                max_value = v;
                selected = child;
            }
        }
        return selected;
    }

    simulate(root_state: MCTS_State, selected: MCTS_State) {
        var move = selected.state.get_playing_agent().updateState().greedy_move();
        if (move.length == 0) return null;
        var nextState = selected.state.next_state(move[0].name, move[1]);
        var mcts_new_state = new MCTS_State(nextState, move);
        mcts_new_state.visits += 1;
        mcts_new_state.set_parent(selected);
        mcts_new_state.sum_score += (mcts_new_state.state.redAgent.getValueOfState(mcts_new_state.state)) * root_state.state.playingTeam;
        return mcts_new_state;
    }

    back_propagate(simulated_state: MCTS_State) {
        var temp = simulated_state;
        var added_score = simulated_state.sum_score;
        while (temp.parent) {
            temp.parent.visits += 1;
            temp.parent.sum_score += added_score;
            temp = temp.parent;
        }
    }









}
