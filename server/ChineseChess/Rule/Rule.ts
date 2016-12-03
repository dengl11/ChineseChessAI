import { Piece } from '../../Objects/Piece';

export class Rule {
    static minRow = 1;
    static maxRow = 10;
    static minCol = 1;
    static maxCol = 9;


    static hasPieceOnRows(col, minRow, maxRow, boardStates: {}) {
        for (var i = minRow; i <= maxRow; i++) {
            if (boardStates[[i, col].toString()]) return true;
        }
        return false;
    }

    static numPieceOnRows(col, minRow, maxRow, boardStates) {
        var r = 0;
        for (var i = minRow; i <= maxRow; i++) {
            if (boardStates[[i, col].toString()]) r += 1;
        }
        return r;
    }



    // return moves within board range and escape positions occupied by own team
    // boardStates: {posStr->[name, isMyPiece]}
    static filterBoundedMoves(currRow, currCol, moves, boardStates) {
        // filter out invalied move
        return moves.filter(m => (
            (m[0] != currRow || m[1] != currCol) &&
            m[0] >= this.minRow &&
            m[0] <= this.maxRow &&
            m[1] <= this.maxCol &&
            m[1] >= this.minCol &&
            !(m.toString() in boardStates && boardStates[m.toString()][1])
        ))
    }


    static movesOnSameLine(currRow, currCol, boardStates) {
        var moves = [];
        for (var i = currRow + 1; i <= this.maxRow; i++) {
            var k = [i, currCol].toString();
            if (k in boardStates) {
                if (!boardStates[k][1]) moves.push([i, currCol]);
                break;
            }
            moves.push([i, currCol]);
        }
        for (var j = currRow - 1; j >= this.minRow; j--) {
            var k = [j, currCol].toString();
            if (k in boardStates) {
                if (!boardStates[k][1]) moves.push([j, currCol]);
                break;
            }
            moves.push([j, currCol]);
        }
        for (var i = currCol + 1; i <= this.maxCol; i++) {
            var k = [currRow, i].toString();
            if (k in boardStates) {
                if (!boardStates[k][1]) moves.push([currRow, i]);
                break;
            }
            moves.push([currRow, i]);
        }
        for (var j = currCol - 1; j >= this.minCol; j--) {
            var k = [currRow, j].toString();
            if (k in boardStates) {
                if (!boardStates[k][1]) moves.push([currRow, j]);
                break;
            }
            moves.push([currRow, j]);
        }
        return moves;
    }

    // Ju
    static possibleMovesForJu(currRow, currCol, boardStates) {
        return this.movesOnSameLine(currRow, currCol, boardStates);
    }

    // Ma
    static possibleMovesForMa(currRow, currCol, boardStates) {
        var moves = [];
        if (!([currRow + 1, currCol].toString() in boardStates)) {
            moves.push([currRow + 2, currCol + 1]);
            moves.push([currRow + 2, currCol - 1]);
        }
        if (!([currRow - 1, currCol].toString() in boardStates)) {
            moves.push([currRow - 2, currCol + 1]);
            moves.push([currRow - 2, currCol - 1]);
        }
        if (!([currRow, currCol + 1].toString() in boardStates)) {
            moves.push([currRow + 1, currCol + 2]);
            moves.push([currRow - 1, currCol + 2]);
        }
        if (!([currRow, currCol - 1].toString() in boardStates)) {
            moves.push([currRow + 1, currCol - 2]);
            moves.push([currRow - 1, currCol - 2]);
        }
        return moves;
    }



    static findFirstOpponentOnRow(row, startCol, states, team, incFn) {
        while (startCol >= this.minCol && startCol <= this.maxCol) {
            var k = [row, startCol].toString();
            if (k in states) {
                if (states[k][1]) return;
                else return [row, startCol];
            }
            startCol = incFn(startCol);
        }
    }
    static findFirstOpponentOnCol(col, startRow, states, team, incFn) {
        while (startRow >= this.minRow && startRow <= this.maxRow) {
            var k = [startRow, col].toString();
            if (k in states) {
                if (states[k][1]) return;
                else return [startRow, col];
            }
            startRow = incFn(startRow);
        }
    }


    // Pao
    static possibleMovesForPao(currRow, currCol, boardStates, team) {
        var inc = (x => x + 1);
        var dec = (x => x - 1);
        var moves = [];
        for (var i = currRow + 1; i <= this.maxRow; i++) {
            var k = [i, currCol].toString();
            if (k in boardStates) {
                var next = this.findFirstOpponentOnCol(currCol, i + 1, boardStates, team, inc);
                if (next) moves.push(next);
                break;
            }
            moves.push([i, currCol]);
        }
        for (var j = currRow - 1; j >= this.minRow; j--) {
            var k = [j, currCol].toString();
            if (k in boardStates) {
                var next = this.findFirstOpponentOnCol(currCol, j - 1, boardStates, team, dec);
                if (next) moves.push(next);
                break;
            }
            moves.push([j, currCol]);
        }
        for (var i = currCol + 1; i <= this.maxCol; i++) {
            var k = [currRow, i].toString();
            if (k in boardStates) {
                var next = this.findFirstOpponentOnRow(currRow, i + 1, boardStates, team, inc);
                if (next) moves.push(next);
                break;
            }
            moves.push([currRow, i]);
        }
        for (var j = currCol - 1; j >= this.minCol; j--) {
            var k = [currRow, j].toString();
            if (k in boardStates) {
                var next = this.findFirstOpponentOnRow(currRow, j - 1, boardStates, team, dec);
                if (next) moves.push(next);
                break;
            }
            moves.push([currRow, j]);
        }
        return moves;
    }

    // Shi
    static possibleMovesForShi(currRow, currCol, boardStates, isLowerTeam) {
        var moves = [];
        if (2 == currRow || currRow == 9) { // in the center
            moves = [
                [currRow - 1, currCol + 1],
                [currRow - 1, currCol - 1],
                [currRow + 1, currCol + 1],
                [currRow + 1, currCol - 1]
            ];
        } else {
            moves = isLowerTeam ? [[2, 5]] : [[9, 5]];
        }
        return moves;
    }

    // King
    static possibleMovesForKing(currRow, currCol, boardStates) {
        var moves = [];
        for (var col = 4; col <= 6; col++)  moves.push([currRow, col]);
        if (currRow < 5) {
            for (var row = 1; row <= 3; row++) moves.push([row, currCol]);
        }
        else {
            for (var row = 8; row <= 10; row++) moves.push([row, currCol]);
        }
        return moves.filter(x => ((x[0] - currRow) * (x[0] - currRow) + (x[1] - currCol) * (x[1] - currCol)) < 2);
    }

    // Xiang
    static possibleMovesForXiang(currRow, currCol, boardStates, isLowerTeam) {
        var moves = [];
        var canMoveDowward = (isLowerTeam || currRow >= 8);
        var canMoveUpward = (currRow <= 3 || !isLowerTeam);
        if (canMoveUpward && !([currRow + 1, currCol + 1].toString() in boardStates)) moves.push([currRow + 2, currCol + 2]);
        if (canMoveUpward && !([currRow + 1, currCol - 1].toString() in boardStates)) moves.push([currRow + 2, currCol - 2]);
        if (canMoveDowward && !([currRow - 1, currCol + 1].toString() in boardStates)) moves.push([currRow - 2, currCol + 2]);
        if (canMoveDowward && !([currRow - 1, currCol - 1].toString() in boardStates)) moves.push([currRow - 2, currCol - 2]);
        return moves;
    }

    // Zu
    static possibleMovesForZu(currRow, currCol, boardStates, isLowerTeam) {
        var beyond = isLowerTeam ? (currRow > 5) : (currRow <= 5); //beyond the river
        var moves = isLowerTeam ? [[currRow + 1, currCol]] : [[currRow - 1, currCol]];
        if (beyond) {
            moves.push([currRow, currCol - 1]);
            moves.push([currRow, currCol + 1]);
        }
        return moves;
    }



    // all legal moves for a piece in a board state
    // boardStates: {posStr->[name, isMyPiece]}
    // return [(row, col)]
    static possibleMoves = function(piece: Piece, boardStates: {}, isLowerTeam) {
        var name = piece.name[0];
        var currRow = piece.position[0];
        var currCol = piece.position[1];
        var moves = [];

        switch (name) {
            case 'j':
                moves = this.possibleMovesForJu(currRow, currCol, boardStates);
                break
            case 'm':
                moves = this.possibleMovesForMa(currRow, currCol, boardStates);
                break
            case 'x':
                moves = this.possibleMovesForXiang(currRow, currCol, boardStates, isLowerTeam);
                break
            case 's':
                moves = this.possibleMovesForShi(currRow, currCol, boardStates, isLowerTeam);
                break
            case 'k':
                moves = this.possibleMovesForKing(currRow, currCol, boardStates);
                break
            case 'p':
                moves = this.possibleMovesForPao(currRow, currCol, boardStates);
                break
            case 'z':
                moves = this.possibleMovesForZu(currRow, currCol, boardStates, isLowerTeam);
                break
        }
        // console.log(piece.name, moves);
        moves = this.filterBoundedMoves(currRow, currCol, moves, boardStates);
        return moves;
    }

    // return a list of all possible moves
    // boardStates: {posStr->[name, isMyPiece]}
    static allPossibleMoves = function(myPieces: Piece[], boardStates: {}, team) {
        var moves = {};
        // team is in the lower part of the river
        var isLowerTeam = (team == 1);
        for (var i in myPieces) {
            var piece = myPieces[i];
            var moves4Piece = this.possibleMoves(piece, boardStates, isLowerTeam);
            // console.log("moves4Piece", piece.name, moves4Piece)
            // if (!moves4Piece || moves4Piece.length == 0) continue;
            moves[piece.name] = moves4Piece;
        }
        return moves;
    }


    // @param: return
    // 0: not end
    // 1: Win
    // -1: Lase
    // {posStr->[name, isMyPiece]}
    static getGameEndState = function(agent) {
        var myPieces: Piece[] = agent.myPieces;
        var oppoPieces: Piece[] = agent.oppoPieces;
        var boardState = agent.boardState;
        return this.getGameEndStateByState(myPieces, oppoPieces, boardState, agent.team)

    }

    static getGameEndStateByState = function(myPieces: Piece[], oppoPieces: Piece[], boardState, team) {
        var myKing = myPieces.filter(x => x.name == 'k')[0];
        var oppoKing = oppoPieces.filter(x => x.name == 'k')[0];
        if (!myKing) return -1;
        if (!oppoKing) return 1;
        var myKingCol = myKing.position[1];
        // not on the same col
        if (myKingCol != oppoKing.position[1]) return 0;
        if (team == 1) {
            var minRow = myKing.position[0] + 1;
            var maxRow = oppoKing.position[0] - 1;
        } else {
            var minRow = oppoKing.position[0] + 1;
            var maxRow = myKing.position[0] - 1;
        }
        if (this.hasPieceOnRows(myKingCol, minRow, maxRow, boardState)) return 0;
        return 1;
    }

}
