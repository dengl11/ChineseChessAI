import { Component, OnInit } from '@angular/core';
import { Piece } from '../Objects/Piece';
import { Draggable } from '../directive/draggable';
import { InitGame } from '../ChineseChess/InitGame/init';
import { Rule } from '../ChineseChess/Rule/Rule';




@Component({
  selector: 'board',
  templateUrl: '../client/app/component_board/board.html',
  styleUrls: ['../client/app/component_board/board.css'],
})

export class BoardComponent implements OnInit {

  myTeam = 1;
  redPieces: Piece[];
  blackPieces: Piece[];
  pieces: Piece[];
  pieceSize: number = 67;
  boardState = {}; // {postion => piece}
  selectedPiece: Piece;
  dummyPieces: Piece[] = [];


  possibleMoves = [];

  ngOnInit() {
    this.addDummyButtons();
    this.initGame();
  }

  initGame() {
    this.selectedPiece = undefined;
    this.possibleMoves = [];
    this.redPieces = InitGame.getRedPieces();
    this.blackPieces = InitGame.getBlackPieces();
    this.refreshAllPiecesOnBoard();
  }

  addDummyButtons() {
    for (var i = 1; i <= 10; i++) {
      for (var j = 1; j <= 9; j++) {
        this.dummyPieces.push(new Piece(0, "", [i, j]));
      }
    }
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

  selectPiece(piece){
     this.selectedPiece = piece;
     this.possibleMoves = Rule.possibleMoves(piece, this.boardState);
  }

  //  click non-dummy piece
  clickPiece(piece) {
    if (!this.selectedPiece && piece.team != this.myTeam) return; // cannot operate enermy pieces
    
    if (!this.selectedPiece || piece.team == this.selectedPiece.team) {
      this.selectPiece(piece);
      return;
    }
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
  }

  // moveSelectedPiece(position) {
  //   this.selectedPiece.move(position);
  //   this.selectedPiece = undefined;
  //   this.refreshAllPiecesOnBoard();
  // }


  clickDummyPiece(piece) {
    if (!this.selectedPiece) return;
    if(! this.isPossibleMove(piece.position)) return; 
    this.movePiece(this.selectedPiece, piece);
  }



  removePiece(piece) {
    var pieces = (piece.team == this.myTeam ? this.redPieces : this.blackPieces);
    for (var i = 0; i < pieces.length; i++) {
      if (pieces[i].name == piece.name) {
        pieces.splice(i, 1); // remove piece from pieces
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
  // isSelected(piece){
  //   console.log('selected?', this.selectedPiece, piece)

  //   return this.selectedPiece && this.selectedPiece.name == piece.name;
  // }



}
