import { Component, OnInit } from '@angular/core';
import { Piece } from '../Objects/Piece';
import { DummyPiece } from '../Objects/DummyPiece';
import { Draggable } from '../directive/draggable';
import { InitGame } from '../ChineseChess/InitGame/init';
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
  redPieces: Piece[];
  blackPieces: Piece[];
  boardState = {}; // {postion => piece}  || NOT including dummy pieces
  redAgent: HumanAgent;
  blackAgent: GreedyAgent;
  playingTeam:number = 1; // which team's turn to play
  humanMode = true;
  gameEndState;




  /***************** UI *******************/
  // keep track of all pieces, just for UI purpose (including dummy pieces)
  pieces: Piece[];
  pieceSize: number = 67;
  selectedPiece: Piece;
  dummyPieces: DummyPiece[] = [];
  possibleMoves = [];

  ngOnInit() {
    this.addDummyButtons();
    this.initGame();
  }

  initGame() {
    this.gameEndState = undefined;
    this.selectedPiece = undefined;
    this.possibleMoves = [];
    this.redPieces = InitGame.getRedPieces(); // [Piece]
    this.blackPieces = InitGame.getBlackPieces(); // [Piece]
    this.refreshAllPiecesOnBoard();
    // init agents
    this.redAgent = new HumanAgent(this.redTeam);
    this.blackAgent = new GreedyAgent(this.blackTeam);
    this.playingTeam = 1;
    if(this.humanMode){
      this.redAgent.updateState(this.redPieces, this.blackPieces);
    }
  }

  // Add dummy pieces to board
  addDummyButtons() {
    for (var i = 1; i <= 10; i++) {
      for (var j = 1; j <= 9; j++) {
        this.dummyPieces.push(new DummyPiece([i, j]));
      }
    }
  }


  getPieceByPos(pos){
    var piece = this.boardState[pos[0]+'-'+pos[1]];
    if (!piece) {
      piece = this.dummyPieces.filter(x=>x.position+'' == pos+'')[0];
    }
    return piece;
  }

  refreshAllPiecesOnBoard() {
    this.pieces = this.redPieces.concat(this.blackPieces);
    this.boardState = {};
    for (var index in this.pieces) {
      var piece = this.pieces[index];
      var pos = piece.position;
      this.boardState[pos[0] + "-" + pos[1]] = piece;
    }
  }

  selectPiece(piece:Piece){
     this.selectedPiece = piece;
     this.possibleMoves = this.redAgent.legalMoves[piece.name];
  }

  //  click non-dummy piece
  clickPiece(piece) {
    if (this.gameEndState) return;
    if (!this.selectedPiece && piece.team != this.redTeam) return; // cannot operate enermy pieces

    // not selected yet
    if (!this.selectedPiece || piece.team == this.selectedPiece.team) {
      this.selectPiece(piece);
      return;
    }
    // having selected some piece
    if(! this.isPossibleMove(piece.position)) return;
    this.movePiece(this.selectedPiece, piece);
  }


  deselectPiece(){
    this.selectedPiece = undefined;
    this.possibleMoves = [];
  }


  // move p1 -> p1
  movePiece(p1, p2: Piece) {
    if (p1.team == p2.team) return;
    p1.move(p2.position);
    if (p2.team == -p1.team) {
      this.removePiece(p2);
    }
    this.deselectPiece();
    this.refreshAllPiecesOnBoard();
    // switch turn to computer
    if (this.humanMode){
      if(this.playingTeam == 1) this.redAgent.addMove(p1.name);
      this.switchTurn();
    }
  }


  clickDummyPiece(piece:Piece) {
    if (!this.selectedPiece) return;
    if(! this.isPossibleMove(piece.position)) return;
    this.movePiece(this.selectedPiece, piece);
  }



  removePiece(piece:Piece) {
    var pieces = (piece.team == this.redTeam ? this.redPieces : this.blackPieces);
    var pos = piece.position;
    for (var i = 0; i < pieces.length; i++) {
      if (pieces[i].name == piece.name) {
        pieces.splice(i, 1); // remove piece from pieces
        this.boardState[pos[0]+'-'+pos[1]] = piece;
        return;
      }
    }
  }


  isPossibleMove(pos){
    for(var i in this.possibleMoves){
      if(this.possibleMoves[i][0] == pos[0] && this.possibleMoves[i][1] == pos[1]) return true;
    }
    return false;
  }


  // switch game turn
  switchTurn(){
    // update playing team
    this.playingTeam = (this.playingTeam == 1? 0:1);
    var agent = (this.playingTeam == 1? this.redAgent : this.blackAgent);
    if (!agent.updateState(this.redPieces, this.blackPieces)) {
      this.gameEndState = this.playingTeam == 1? 'Lose':'Win';
      return;
    }
    // if human's turn, return
    if (this.humanMode && this.playingTeam == 1) return;

    var move = agent.nextMove();
    // console.log("move: ", move);
    // console.log("to: ",  this.getPieceByPos(move[1]));
    this.movePiece(this.getPieceByPos(move[0]), this.getPieceByPos(move[1]))
  }


}
