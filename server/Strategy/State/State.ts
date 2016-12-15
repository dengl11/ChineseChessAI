import { Agent } from '../Agent/Agent'
import { GreedyAgent } from '../Greedy/GreedyAgent'
import { ABPruning } from '../ABPruning/ABPruning'
import { TDLearner } from '../TDLearner/TDLearner'
import { TDLearnerTrained } from '../TDLearner/TDLearnerTrained'
import { MCTS } from '../MCTS/MCTS'
import { Reorder } from '../Reorder/Reorder'
import { Rule } from '../../ChineseChess/Rule/Rule'

export class State {
    redAgent: Agent;
    blackAgent: Agent;
    playingTeam: number;

    is_repeating = false;

    constructor(redAgent: Agent, blacAgent: Agent, playingTeam = 1, updateDict = false) {
        this.redAgent = redAgent;
        this.blackAgent = blacAgent;
        this.playingTeam = playingTeam;
        this.blackAgent.setOppoAgent(this.redAgent);
        this.redAgent.setOppoAgent(this.blackAgent);
    }

    // return playing agent in control
    get_playing_agent() { return this.playingTeam == 1 ? this.redAgent : this.blackAgent; }

    // return | 1:win | -1:lose | 0:continue for playing team
    getEndState() {
        var playing = this.get_playing_agent();
        var endState = Rule.getGameEndState(playing);
        return endState;
    }
    // return a copy of state
    copy() { return new State(this.redAgent.copy(), this.blackAgent.copy(), this.playingTeam); }

    // return next state by action
    next_state(movePieceName, toPos) {
        return this.get_next_by_team(movePieceName, toPos, this.playingTeam);
    }

    get_next_by_team(movePieceName, toPos, team) {
        // make a copy a state
        var nextState = this.copy();
        nextState.switchTurn();
        var agent = nextState.get_playing_agent().oppoAgent;
        // console.log(agent)
        // console.log("movePieceName", movePieceName)
        agent.movePieceTo(agent.getPieceByName(movePieceName), toPos);
        return nextState;

    }

    switchTurn() { this.playingTeam = -this.playingTeam; }

    // return a evaluation score for this state
    getEvaludation(team) { }

    static check_repeating(agent): boolean {
        var moves = agent.pastMoves;
        var n = moves.length;
        if (n < 10) return false;
        if (this.samveMove(moves[n - 1], moves[n - 3]) && this.samveMove(moves[n - 5], moves[n - 3])) {
            console.log(moves)
            return true;
        };
        return false;
    }

    static samveMove(move1, move2) {
        return move1.name == move2.name && (move1.position.toString() == move2.position.toString());
    }


    static copyFromDict(dict) {
        var agentDict;
        if (dict.playingTeam == 1) {
            var agentDict = dict.redAgent;
            var oppo = dict.blackAgent;
        } else {
            var agentDict = dict.blackAgent;
            var oppo = dict.redAgent;
        }
        oppo = Agent.copyFromDict(oppo);
        var agent;
        // console.log(agentDict.strategy)
        var is_repeating = this.check_repeating(agentDict);

        if (agentDict.strategy == 0) agent = GreedyAgent.copyFromDict(agentDict);
        if (agentDict.strategy == 1) agent = ABPruning.copyFromDict(agentDict);
        if (agentDict.strategy == 2) agent = Reorder.copyFromDict(agentDict);
        if (agentDict.strategy == 3) agent = TDLearner.copyFromDict(agentDict);
        if (agentDict.strategy == 4) agent = TDLearnerTrained.copyFromDict(agentDict);
        if (agentDict.strategy == 5) agent = MCTS.copyFromDict(agentDict);
        var new_state;
        if (dict.playingTeam == 1) new_state = new State(agent, oppo, dict.playingTeam);
        else new_state = new State(oppo, agent, dict.playingTeam);
        new_state.is_repeating = is_repeating;
        return new_state;
    }



    nextMove() {
        var agent = this.get_playing_agent();
        var r = null;
        if (agent.check_king_exist()) {
            if (!this.is_repeating) r = agent.comptuteNextMove(this);
            else {
                console.log("REPEATING ")
                agent.updateState();
                r = agent.random_move();
            }
        } else console.log("-=-=-=-=-=- KING DIED -=-=-=-=-=-", r)
        return r;
    }

}
