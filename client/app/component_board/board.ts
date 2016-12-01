import { Component, OnInit } from '@angular/core';
import { ComputeService } from '../service/service.compute';
import { Piece } from '../Objects/Piece';
import { DummyPiece } from '../Objects/DummyPiece';
import { Draggable } from '../directive/draggable';

import { Rule } from '../ChineseChess/Rule/Rule';
import { State } from '../Strategy/State/State';
import { GreedyAgent } from '../Strategy/Greedy/GreedyAgent';
import { EvalFnAgent } from '../Strategy/EvalFn/EvaluationFn';
import { HumanAgent } from '../Strategy/Agent/HumanAgent';
import { Agent } from '../Strategy/Agent/Agent';

@Component({
    selector: 'board',
    templateUrl: '../client/app/component_board/board.html',
    styleUrls: ['../client/app/component_board/board.css'],
    providers: [ComputeService]
})

export class BoardComponent implements OnInit {

    /***************** CONTROL *******************/
    redTeam = 1;
    blackTeam = -1;
    boardState = {}; // {postion => piece}  || NOT including dummy pieces
    humanMode = true;
    state: State;
    server: ComputeService;
    redAgentType = 0;
    blackAgentType = 2;





    /***************** UI *******************/
    // keep track of all pieces, just for UI purpose (including dummy pieces)
    pieceSize: number = 67;
    selectedPiece: Piece;
    gameEndState;
    dummyPieces: DummyPiece[] = [];
    subscription: any;
    lastState: State;
    inSimulation = false;


    changeMode() {
        this.humanMode = !this.humanMode;
        this.initGame();
    }
    isPossibleMove(pos) {
        if (!this.selectedPiece) return false;
        var moves = this.state.redAgent.legalMoves[this.selectedPiece.name];
        return moves.map(x => x + '').indexOf(pos + '') >= 0;
    }
    // Add dummy pieces to board
    initDummyButtons() {
        this.dummyPieces = [];
        for (var i = 1; i <= 10; i++) {
            for (var j = 1; j <= 9; j++) {
                this.dummyPieces.push(new DummyPiece([i, j]));
            }
        }
    }

    chooseRedAgent(desc) {
        if (desc == "") { this.redAgentType = 1; }
        if (desc.includes('2')) { this.redAgentType = 2; }
        if (desc.includes('3')) { this.redAgentType = 3; }
    }
    chooseBlackAgent(desc) {
        if (desc == "") { this.blackAgentType = 1; }
        if (desc.includes('2')) { this.blackAgentType = 2; }
        if (desc.includes('3')) { this.blackAgentType = 3; }
        if (this.humanMode) this.initGame();
    }

    /***************** LIFE_CYCLE *******************/
    ngOnInit() {
        this.initDummyButtons();
        this.initGame();

    }
    constructor(server: ComputeService) {
        this.server = server;
    }

    initGame() {
        this.gameEndState = undefined;
        this.selectedPiece = undefined;
        this.lastState = null;
        // init agents
        var redAgent;
        switch (this.redAgentType) {
            case 1: { redAgent = new GreedyAgent(this.redTeam); break; }
            case 2: { redAgent = new EvalFnAgent(this.redTeam, 2); break; }
            case 3: { redAgent = new EvalFnAgent(this.redTeam, 3); break; }
            default: redAgent = new HumanAgent(this.redTeam); break;
        }
        var blackAgent;
        switch (this.blackAgentType) {
            case 1: { blackAgent = new GreedyAgent(this.blackTeam); break; }
            case 2: { blackAgent = new EvalFnAgent(this.blackTeam, 2); break; }
            case 3: { blackAgent = new EvalFnAgent(this.blackTeam, 3); break; }
            default: blackAgent = new GreedyAgent(this.blackTeam); break;
        }

        this.state = new State(redAgent, blackAgent);
    }


    simulate() {
        if (this.redAgentType == 0) this.redAgentType = 2;
        this.initGame();
        this.continue_simulate();
    }
    continue_simulate() {
        this.inSimulation = true;
        this.switchTurn();
    }

    stop_simulate() {
        this.inSimulation = false;
    }
    clickDummyPiece(piece: Piece) {
        if (!this.isPossibleMove(piece.position) || this.gameEndState) return;
        this.humanMove(piece);
    }

    clickRedPiece(piece: Piece) {
        if (this.gameEndState) return;
        this.selectedPiece = piece;
    }

    clickBlackPiece(piece: Piece) {
        if (!this.isPossibleMove(piece.position) || this.gameEndState) return;
        this.humanMove(piece);
    }

    humanMove(piece: Piece) {
        // before human makes move, make a copy of current state
        this.copyCurrentState();
        this.state.redAgent.movePieceTo(this.selectedPiece, piece.position, true);
        this.switchTurn();
    }
    // switch game turn
    switchTurn() {
        // stop simulation
        if (!this.humanMode && !this.inSimulation) return;
        // update playing team
        this.state.switchTurn();
        var agent = (this.state.playingTeam == 1 ? this.state.redAgent : this.state.blackAgent);
        agent.updateState();
        this.selectedPiece = undefined;
        var endState = this.state.getEndState();
        if (endState != 0) {
            this.inSimulation = false;
            this.gameEndState = endState * this.state.playingTeam == -1 ? 'Lose' : 'Win';
            return;
        }
        // if human's turn, return
        if (this.humanMode && this.state.playingTeam == 1) return;
        // agent.nextMove();
        // this.switchTurn();
        this.server.launchCompute(this.state.copy(false)).then(
            move => {
                var piece = agent.getPieceByName(move[0].name);
                agent.movePieceTo(piece, move[1]);
                this.switchTurn();
            }
        );
    }
    // reverse game state to previous state
    go2PreviousState() {
        this.state = this.lastState;
        this.lastState = null;
        this.gameEndState = null;
    }

    copyCurrentState() {
        this.lastState = this.state.copy();
    }
}
