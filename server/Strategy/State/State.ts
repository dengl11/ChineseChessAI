import { Agent } from '../Agent/Agent'
import { GreedyAgent } from '../Greedy/GreedyAgent'
import { EvalFnAgent } from '../EvalFn/EvaluationFn'
import { TDLeaner } from '../TDLearner/TDLearner'
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
        this.blackAgent.setOppoAgent(this.redAgent, updateDict);
        this.redAgent.setOppoAgent(this.blackAgent, updateDict);
    }

    // return playing agent in control
    get_playing_agent() {
        return this.playingTeam == 1 ? this.redAgent : this.blackAgent;;
    }

    // return | 1:win | -1:lose | 0:continue for playing team
    getEndState() {
        var playing = this.get_playing_agent();
        var endState = Rule.getGameEndState(playing);
        return endState;
    }
    // return a copy of state
    copy(setOppoo = true) {
        var newState = new State(this.redAgent.copy(), this.blackAgent.copy(), this.playingTeam);
        if (setOppoo) {
            newState.redAgent.setOppoAgent(newState.blackAgent);
            newState.blackAgent.setOppoAgent(newState.redAgent);
        }
        return newState;
    }

    // return next state by action
    next_state(movePieceName, toPos, updateAgentPieceDict = false) {
        return this.get_next_by_team(movePieceName, toPos, this.playingTeam, updateAgentPieceDict);
    }

    get_next_by_team(movePieceName, toPos, team, updateAgentPieceDict = false) {
        // make a copy a state
        var nextState = this.copy();
        nextState.switchTurn();
        var agent = team == 1 ? nextState.redAgent : nextState.blackAgent;
        // console.log(agent.myPieces, " - Move:", movePieceName)
        // console.log(agent.team, movePieceName, agent.myPieces, agent.getPieceByName(movePieceName), " - Move:", toPos)
        agent.movePieceTo(agent.getPieceByName(movePieceName), toPos);
        agent.updateState(updateAgentPieceDict);
        agent.oppoAgent.updateState(updateAgentPieceDict);
        return nextState;

    }

    switchTurn() {
        this.playingTeam = -this.playingTeam;
    }
    // return a evaluation score for this state
    getEvaludation(team) {

    }

    static check_repeating(agent): boolean {
        var moves = agent.pastMoves;
        var n = moves.length;
        if (n < 10) return false;
        return (moves[n - 3].toString() == moves[n - 1].toString());
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
        var is_repeating = this.check_repeating(agentDict);
        if (agentDict.strategy == 0) agent = GreedyAgent.copyFromDict(agentDict);
        if (agentDict.strategy == 1) agent = EvalFnAgent.copyFromDict(agentDict);
        if (agentDict.strategy == 2) agent = Reorder.copyFromDict(agentDict);
        if (agentDict.strategy == 3) agent = TDLeaner.copyFromDict(agentDict);
        // console.log("is TD?:", agent instanceof TDLeaner);
        var new_state;
        if (dict.playingTeam == 1) new_state = new State(agent, oppo, dict.playingTeam);
        else new_state = new State(oppo, agent, dict.playingTeam);
        new_state.is_repeating = is_repeating;
        return new_state;
    }



    nextMove() {
        var agent = this.playingTeam == 1 ? this.redAgent : this.blackAgent;
        // console.log("playing:", agent.strategy)
        // if (agent instanceof EvalFnAgent)
        //     console.log("depth:", agent.DEPTH)
        var r = null;
        if (agent.check_king_exist()) {
            if (!this.is_repeating) r = agent.comptuteNextMove();
            else {
                console.log("REPEATING ")
                r = agent.random_move();
            }
        } else console.log("-=-=-=-=-=- KING DIED -=-=-=-=-=-", r)
        return r;
    }

}
