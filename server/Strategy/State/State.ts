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
        // make a copy a state
        var nextState = this.copy();
        nextState.switchTurn();
        var agent = this.playingTeam == 1 ? nextState.redAgent : nextState.blackAgent;
        console.log(agent.getPieceByName(movePieceName), " - Move:", movePieceName)
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
        if (agentDict.strategy == 0) agent = GreedyAgent.copyFromDict(agentDict);
        if (agentDict.strategy == 1) agent = EvalFnAgent.copyFromDict(agentDict);
        if (agentDict.strategy == 2) agent = Reorder.copyFromDict(agentDict);
        if (agentDict.strategy == 3) agent = TDLeaner.copyFromDict(agentDict);
        // console.log("is TD?:", agent instanceof TDLeaner);
        if (dict.playingTeam == 1) return new State(agent, oppo, dict.playingTeam);
        return new State(oppo, agent, dict.playingTeam);
    }

    nextMove() {
        var agent = this.playingTeam == 1 ? this.redAgent : this.blackAgent;
        // console.log("playing:", agent.strategy)
        // if (agent instanceof EvalFnAgent)
        //     console.log("depth:", agent.DEPTH)
        var r = null;
        if (agent.check_king_exist()) r = agent.comptuteNextMove();
        // console.log("move:", r)
        return r;
    }

}
