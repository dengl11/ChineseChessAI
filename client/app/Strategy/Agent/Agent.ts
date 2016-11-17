import { Piece } from '../../Objects/Piece';
import { Rule } from '../../ChineseChess/Rule/Rule'

export class Agent{
  legalMoves:{}; // name->[positions]
  pastMoves=[];
  myPieces:Piece[];
  myPiecesDic:{}; // {name -> pos}
  oppoPieces:Piece[];
  boardState: {}; // {posStr->[name, isMyPiece]}
  team:number;


  constructor(team: number) {
    this.team = team;
  }

  addMove(pieceName){
    this.pastMoves.push(pieceName);
  }

  // [fromPos, toPos]
  nextMove(){
    var computeResult = this.comptuteNextMove();
    var pieceName = computeResult[0];
    var fromPos = computeResult[1];
    var toPos = computeResult[2];
    // console.log("init move:", [fromPos, toPos]);
    if(this.team != 1) {
      toPos = this.revertPosition(toPos);
      fromPos = this.revertPosition(fromPos);
    }
    // console.log("after move:", [fromPos, toPos]);
    if (this.team != 1) this.revertGameDirection();
    this.addMove(pieceName);
    return [fromPos, toPos];
  };

  // private method of computing next move
  comptuteNextMove(){
    console.log("parent comptuteNextMove")
    var pieceNames = Object.keys(this.legalMoves);
    var pieceName = pieceNames[Math.floor(Math.random() * pieceNames.length)];
    var toPos = this.legalMoves[pieceName][0];
    var fromPos:number[] = this.myPieces.filter(x=>x.name == pieceName)[0].position;
    return [pieceName, fromPos, toPos];
  }

  isLose(){
    return this.myPieces.filter(x=>x.name=='k').length == 0;
  }

  // update agent state
  updateState(redPieces, blackPieces){
    // console.log("updateState:", this.team)
    this.myPieces = (this.team == 1 ? redPieces : blackPieces);
    if( this.isLose()) return false;
    // console.log("myPieces:", this.myPieces)
    this.oppoPieces = (this.team == 1 ? blackPieces : redPieces);
    // console.log("oppo:", this.oppoPieces)
    if (this.team != 1) this.revertGameDirection();
    var boardState = this.getBoardState();
    this.computeLegalMoves(boardState);
    return true;
  }

  // pos: [row, col]
  revertPosition(pos){
    return [11-pos[0], 10-pos[1]];
  }

  // pos: [row, col]
  revertPosition4Pieces(pieces){
    for (var i in pieces){
      var pos = pieces[i].position;
      pieces[i].position = this.revertPosition(pos);
    }
  }
  // pos: [row, col]
  addPieces2State(pieces, boardState, isMyPiece){
    for (var i in pieces){
      var pos = pieces[i].position;
      var posStr = pos[0]+'-'+pos[1];
      boardState[posStr] = pieces[i];
      this.boardState[posStr] = [pieces[i].name, isMyPiece]
      if(isMyPiece){
        this.myPiecesDic[pieces[i].name] = pos;
      }
    }
  }

  // reverse game direction for black part
  // to keep the consisttance of Agent
  revertGameDirection(){
    this.revertPosition4Pieces(this.myPieces);
    this.revertPosition4Pieces(this.oppoPieces);
  }

  getBoardState(){
    var new_state = {};
    this.boardState = {};
    this.myPiecesDic = {};
    this.addPieces2State(this.myPieces, new_state, true);
    this.addPieces2State(this.oppoPieces, new_state, false);
    return new_state;
  }




  computeLegalMoves(boardState){
    this.legalMoves = Rule.allPossibleMoves(this.myPieces, boardState);
  }

}
