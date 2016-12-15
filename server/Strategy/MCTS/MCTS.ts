
import { Agent } from '../Agent/Agent'
import { State } from '../State/State'
import { StateFeatureExtractor } from '../State/StateFeatureExtractor'
import { MCTS_State } from './MCTS_State'

export class MCTS extends Agent {

    strategy = 5;
    N_SIMULATION;

    constructor(team, pieces, N) {
        super(team, pieces);
        // this.N_SIMULATION = 4000;
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
            // console.log("selecting:", seleted_state.depth(), "- from -", seleted_state.parentMove);
            // console.log("selecting: visits", seleted_state.visits);
            // console.log("selecting: sum score", seleted_state.sum_score);
            // if (!seleted_state) continue; // end state
            var simulated_state = this.simulate(root, seleted_state);
            // console.log("simulated_state:", simulated_state.depth());
            // this.back_propagate(simulated_state);
            if (simulated_state) this.back_propagate(simulated_state);
            // if (root.children.filter(x => x.visits == 0).length == 0) {
            //     for (var i in root.children) {
            //         console.log(root.children[i].parentMove, " => [ave SCORE: ]", root.children[i].get_ave_score(), "=> [visits]:", root.children[i].visits)
            //     }
            // }
        }
        // for (var i in root.children) {
        //     console.log(root.children[i].parentMove, " => [SUM SCORE: ]", root.children[i].sum_score, " => [ave SCORE: ]", root.children[i].get_ave_score(), "=> [visits]:", root.children[i].visits)
        // }
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
        // mcts_state.children[0].parent
        // console.log("======================CHILDREDN: ", mcts_state.visits, mcts_state.children.length, "======================")
        var selected = this.pick_max_UCB_child(mcts_state);
        // console.log("SELECT:", selected.parentMove)
        if (selected) return this.select(selected);
        // if (selected) return this.select(selected);
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
        // console.log("simulate: move=", move)
        if (move.length == 0) return null;
        var nextState = selected.state.next_state(move[0].name, move[1]);
        // console.log("simulate: nextState=", nextState)
        var mcts_new_state = new MCTS_State(nextState, move);
        // console.log("mcts_new_state:", mcts_new_state)
        mcts_new_state.visits += 1;
        mcts_new_state.set_parent(selected);
        mcts_new_state.sum_score += (mcts_new_state.state.redAgent.getValueOfState(mcts_new_state.state)) * root_state.state.playingTeam;
        return mcts_new_state;
    }

    back_propagate(simulated_state: MCTS_State) {
        var temp = simulated_state;
        var added_score = simulated_state.sum_score;
        // console.log("emp.parent:", temp.parent)
        while (temp.parent) {
            // console.log("back_propagate:", temp.parent.visits)
            temp.parent.visits += 1;
            temp.parent.sum_score += added_score;
            temp = temp.parent;
        }
    }









}
