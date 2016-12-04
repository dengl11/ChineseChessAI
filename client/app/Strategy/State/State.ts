import { Agent } from '../Agent/Agent'
import { Rule } from '../../ChineseChess/Rule/Rule'

export class State {
    redAgent: Agent;
    blackAgent: Agent;
    playingTeam: number;
    endFlag = null; // null: on going | 1: red win | -1: black win | 0: draw

    constructor(redAgent: Agent, blacAgent: Agent, playingTeam = 1, setOppoo = true) {
        this.redAgent = redAgent;
        this.blackAgent = blacAgent;
        this.playingTeam = playingTeam;
        if (setOppoo) {
            this.blackAgent.setOppoAgent(this.redAgent);
            this.redAgent.setOppoAgent(this.blackAgent);
        }
    }

    // TDlearning
    learn(nSimulations) {
        this.redAgent.update_weights(nSimulations, this.endFlag);
        this.blackAgent.update_weights(nSimulations, this.endFlag);
    }
    record_feature(feature_vec) {
        // console.log("record_feature")
        this.redAgent.save_state(feature_vec);
        this.blackAgent.save_state(feature_vec);
    }

    // return | 1:win | -1:lose | 0:continue for playing team
    getEndState() {
        var playing = this.playingTeam == 1 ? this.redAgent : this.blackAgent;
        var endState = Rule.getGameEndState(playing);
        return endState;
    }
    // return a copy of state
    copy(setOppoo = true) {
        var newState = new State(this.redAgent.copy(), this.blackAgent.copy(), this.playingTeam, setOppoo);
        return newState;
    }

    // // return next state by action
    // next_state(movePieceName, toPos) {
    //     // make a copy a state
    //     var nextState = this.copy();
    //     nextState.switchTurn();
    //     var agent = this.playingTeam == 1 ? nextState.redAgent : nextState.blackAgent;
    //     agent.movePieceTo(agent.getPieceByName(movePieceName), toPos);
    //     agent.updateState();
    //     agent.oppoAgent.updateState();
    //     return nextState;
    // }

    switchTurn() {
        this.playingTeam = -this.playingTeam;
    }
    // return a evaluation score for this state
    getEvaludation(team) {

    }

}
