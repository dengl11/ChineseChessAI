
import {Piece} from '../../Objects/Piece'
export class InitGame {


    static getRedPieces() {
        return [
            new Piece('j1', [1, 1]),
            new Piece('j2', [1, 9]),
            new Piece('p1', [3, 2]),
            new Piece('p2', [3, 8]),
            new Piece('m1', [1, 2]),
            new Piece('m2', [1, 8]),
            new Piece('x1', [1, 3]),
            new Piece('x2', [1, 7]),
            new Piece('s1', [1, 4]),
            new Piece('s2', [1, 6]),
            new Piece('z1', [4, 1]),
            new Piece('z2', [4, 3]),
            new Piece('z3', [4, 5]),
            new Piece('z4', [4, 7]),
            new Piece('z5', [4, 9]),
            new Piece('k', [1, 5])
        ];

    }

    static getBlackPieces() {
        return [
            new Piece('j1', [10, 1]),
            new Piece('j2', [10, 9]),
            new Piece('p1', [8, 2]),
            new Piece('p2', [8, 8]),
            new Piece('m1', [10, 2]),
            new Piece('m2', [10, 8]),
            new Piece('x1', [10, 3]),
            new Piece('x2', [10, 7]),
            new Piece('s1', [10, 4]),
            new Piece('s2', [10, 6]),
            new Piece('z1', [7, 1]),
            new Piece('z2', [7, 3]),
            new Piece('z3', [7, 5]),
            new Piece('z4', [7, 7]),
            new Piece('z5', [7, 9]),
            new Piece('k', [10, 5])
        ];
    }



}
