import '../node_modules/jquery/dist/jquery.js';
import '../node_modules/@chrisoakman/chessboardjs/dist/chessboard-1.0.0.js';
import { highlightMoves } from './scripts/highlight.js';
import { Game } from './scripts/game.js';

const myGame = new Game();
let board = null;
const $status = $('#status');
const $fen = $('#fen');
const $pgn = $('#pgn');

console.log(myGame.game);
console.log(myGame.isOver);
console.log(board);

function removeGreySquares () {
  $('#board .square-55d63').css('background', '');
};

function onDragStart (source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (myGame.isOver) return false;

  // only pick up current turn player's piece
  if ((myGame.playerTurn === 'w' && piece.search(/^b/) !== -1) ||
      (myGame.playerTurn === 'b' && piece.search(/^w/) !== -1)) {
    return false;
  };
};

function onDrop (source, target) {
  removeGreySquares();

  // see if the move is legal
  const move = myGame.makeMove(source, target);

  // illegal move
  if (move === null) return 'snapback';

  updateStatus();
};

function onMouseoverSquare (square, piece) {
  // get list of possible moves for this square
  const moves = myGame.possibleMoves(square);
  highlightMoves(square, moves); 
};

function onMouseoutSquare (square, piece) {
  removeGreySquares();
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
  board.position(myGame.getFen);
};

function updateStatus () {
  let status = '';

  let moveColor = 'White';
  if (myGame.playerTurn === 'b') {
    moveColor = 'Black';
  };

  // checkmate?
  if (myGame.inCheckmate) {
    status = 'Game over, ' + moveColor + ' is in checkmate.';
  } else if (myGame.inDraw) { // draw?
    status = 'Game over, drawn position';
  } else { // game still on
    status = moveColor + ' to move';
    // check?
    if (myGame.inCheck) {
      status += ', ' + moveColor + ' is in check';
    }
  };

  $status.html(status);
  $fen.html(myGame.getFen);
  $pgn.html(myGame.getPgn);
}


const config = {
  draggable: true,
  position: 'start',
  pieceTheme: 'img/{piece}.png',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare,
  onSnapEnd: onSnapEnd,
};

board = Chessboard('board', config);
console.log(board);

updateStatus();

$('#startBtn').on('click', board.start);
$('#clearBtn').on('click', board.clear);



console.log("Hello, world!");

