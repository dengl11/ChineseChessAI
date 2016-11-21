import { Component, OnInit } from '@angular/core';
import { Piece } from '../Objects/Piece';
import { DummyPiece } from '../Objects/DummyPiece';
import { Draggable } from '../directive/draggable';

import { Rule } from '../ChineseChess/Rule/Rule';
import { GreedyAgent } from '../Strategy/Greedy/GreedyAgent';
import { HumanAgent } from '../Strategy/Agent/HumanAgent';




@Component({
    selector: 'board',
    templateUrl: '../client/app/component_board/board.html',
    styleUrls: ['../client/app/component_board/board.css'],
})

export class BoardComponent implements OnInit {

    /***************** CONTROL *******************/
    redTeam = 1;
    blackTeam = -1;
    boardState = {}; // {postion => piece}  || NOT including dummy pieces
    redAgent: HumanAgent;
    blackAgent: GreedyAgent;
    playingTeam: number; // which team's turn to play
    humanMode = true;
    gameEndState;




    /***************** UI *******************/
    // keep track of all pieces, just for UI purpose (including dummy pieces)
    pieceSize: number = 67;
    selectedPiece: Piece;
    dummyPieces: DummyPiece[] = [];

    ngOnInit() {
        this.initDummyButtons();
        this.initGame();
    }

    initGame() {
        this.gameEndState = undefined;
        this.selectedPiece = undefined;
        // init agents
        this.redAgent = new HumanAgent(this.redTeam);
        this.blackAgent = new GreedyAgent(this.blackTeam);
        this.redAgent.setOppoPieces(this.blackAgent.myPieces);
        this.blackAgent.setOppoPieces(this.redAgent.myPieces);
        this.playingTeam = 1;
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

    isPossibleMove(pos) {
        if (!this.selectedPiece) return false;
        var moves = this.redAgent.legalMoves[this.selectedPiece.name];
        return moves.filter(x => x + '' == pos + '').length > 0;
    }

    clickDummyPiece(piece: Piece) {
        if (!this.isPossibleMove(piece.position) || this.gameEndState) return;
        this.redAgent.movePieceTo(this.selectedPiece, piece.position, false);
        this.switchTurn();
    }

    clickRedPiece(piece: Piece) {
        if (this.gameEndState) return;
        this.selectedPiece = piece;
    }

    clickBlackPiece(piece) {
        if (!this.isPossibleMove(piece.position) || this.gameEndState) return;
        this.redAgent.movePieceTo(this.selectedPiece, piece.position, true);
        this.switchTurn();
    }
    // switch game turn
    switchTurn() {
        // update playing team
        this.playingTeam = (this.playingTeam == 1 ? -1 : 1);
        var agent = (this.playingTeam == 1 ? this.redAgent : this.blackAgent);
        var endState = agent.updateState();
        this.selectedPiece = undefined;
        if (endState != 0) {
            this.gameEndState = endState * this.playingTeam == -1 ? 'Lose' : 'Win';
            return;
        }
        // if human's turn, return

        if (this.humanMode && this.playingTeam == 1) {
            return;
        }
        agent.nextMove();
        this.switchTurn();
    }


}
