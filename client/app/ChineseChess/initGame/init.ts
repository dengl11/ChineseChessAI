import { Piece } from '../../Objects/Piece';

export class InitGame  {


  static getRedPieces(){
      return [
      new Piece(1, 'j1', [1,1]),
      new Piece(1, 'm1', [1,2]),
      new Piece(1, 'x1', [1,3]),
      new Piece(1, 's1', [1,4]),
      new Piece(1, 'k', [1,5]),
      new Piece(1, 's2', [1,6]),
      new Piece(1, 'x2', [1,7]),
      new Piece(1, 'm2', [1,8]),
      new Piece(1, 'j2', [1,9]),
      new Piece(1, 'p1', [3,2]),
      new Piece(1, 'p2', [3,8]),
      new Piece(1, 'z1', [4,1]),
      new Piece(1, 'z2', [4,3]),
      new Piece(1, 'z3', [4,5]),
      new Piece(1, 'z4', [4,7]),
      new Piece(1, 'z5', [4,9])
  ];
  }

   static getBlackPieces(){
      return [
      new Piece(-1, 'j1', [10,1]),
      new Piece(-1, 'm1', [10,2]),
      new Piece(-1, 'x1', [10,3]),
      new Piece(-1, 's1', [10,4]),
      new Piece(-1, 'k', [10,5]),
      new Piece(-1, 's2', [10,6]),
      new Piece(-1, 'x2', [10,7]),
      new Piece(-1, 'm2', [10,8]),
      new Piece(-1, 'j2', [10,9]),
      new Piece(-1, 'p1', [8,2]),
      new Piece(-1, 'p2', [8,8]),
      new Piece(-1, 'z1', [7,1]),
      new Piece(-1, 'z2', [7,3]),
      new Piece(-1, 'z3', [7,5]),
      new Piece(-1, 'z4', [7,7]),
      new Piece(-1, 'z5', [7,9])
  ];
  }



}
