const gameBoard = document.querySelector("#gameboard");
const playerDisplay = document.querySelector("#player");
const infoDisplay = document.querySelector("#info-display");


const width = 8;
let playerGo = 'white'
playerDisplay.textContent = playerGo;

const startPieces = [
    'br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br',
    'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp',
    'wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr',


]

function createBoard () {
    startPieces.forEach((startPiece, i) => {
        const square = document.createElement('div');
        square.classList.add('square');
        square.setAttribute('square-id', 63 - i);

        // which row we are currently on
        const row = Math.floor((63 - i) / 8) + 1;
        if (row % 2 === 0) {
            square.classList.add( i % 2 === 0 ? "white-square": "green-square");
        }
        else {
            square.classList.add( i % 2 === 0 ? "green-square": "white-square");
        }

        // create pieces
        if (startPiece !== '') {
            const piece = document.createElement('div');
            piece.classList.add(startPiece);
            piece.classList.add("piece");

            if (i <= 15) {
                piece.classList.add('black');
            }

            if (i >= 48) {
                piece.classList.add('white');
            }

            switch (startPiece) {
                case 'wp':
                    piece.setAttribute('id', 'pawn')
                    break;
                case 'bp':
                    piece.setAttribute('id', 'pawn')
                    break;
                case 'wk':
                    piece.setAttribute('id', 'king')
                    break;
                case 'bk':
                    piece.setAttribute('id', 'king')
                    break;
                case 'wq':
                    piece.setAttribute('id', 'queen')
                    break;
                case 'bq':
                    piece.setAttribute('id', 'queen')
                    break;
                case 'wr':
                    piece.setAttribute('id', 'rook')
                    break;
                case 'br':
                    piece.setAttribute('id', 'rook')
                    break;
                case 'wn':
                    piece.setAttribute('id', 'knight')
                    break;
                case 'bn':
                    piece.setAttribute('id', 'knight')
                    break;
                case 'wb':
                    piece.setAttribute('id', 'bishop')
                    break;
                case 'bb':
                    piece.setAttribute('id', 'bishop')
                    break;
                case 'wp':
            
                default:
                    break;
            }


            square.append(piece)
 
        }

        // if the square has a piece than make it draggable
        square.firstChild?.setAttribute('draggable', true)
        
        gameBoard.append(square);
    })
}

createBoard();


const allSquares = document.querySelectorAll(".square");
allSquares.forEach(square => {
    square.addEventListener('dragstart', dragStart)
    square.addEventListener('dragover', dragOver)
    square.addEventListener('drop', dragDrop)
})

// to get the starting square id
let startPositionId;
let draggedElement;

function dragStart (e) {
    startPositionId = e.target.parentNode.getAttribute('square-id');
    draggedElement = e.target;
}


function dragOver (e) {
    e.preventDefault();
}

function dragDrop (e) {
    e.stopPropagation();

    const correctGo = draggedElement.classList.contains(playerGo);
    const taken = e.target.classList.contains('piece');
    const valid = checkIfValid(e.target);
    const oponentGo = playerGo === 'white'? 'black' : 'white';
    const takenByOponent = e.target?.classList.contains(oponentGo);

    if (correctGo ) {
        if (takenByOponent && valid) {
            e.target.parentNode.append(draggedElement)
            e.target.remove();
            checkForWin ()
            changePlayer();

            var audio = new Audio('sounds/capture.mp3');
            audio.play();

            return
        }
        if (taken && !takenByOponent) {
            infoDisplay.textContent = "you cannot go here"
            setTimeout(() => { infoDisplay.textContent = ''}, 2000);
            return;
        }
        if (valid) {
            e.target.append(draggedElement);
            checkForWin ()
            changePlayer();

            
            var audio = new Audio('sounds/move-self.mp3');
            audio.play();

            return;
        }
        else {
            console.log('Not valid')
        }
    }
    


}

function changePlayer() {
    if (playerGo === 'black') {
        reverseIds();
        playerGo = 'white'
        playerDisplay.textContent = playerGo;
    } else {
        revertIds();
        playerGo = 'black'
        playerDisplay.textContent = playerGo;
    }
}

function reverseIds () {
    const allSquares = document.querySelectorAll(".square");
    allSquares.forEach((square, i) => { square.setAttribute('square-id', ( width*width - 1) -i) });
}

function revertIds () {
    const allSquares = document.querySelectorAll(".square");
    allSquares.forEach((square, i) => { square.setAttribute('square-id', i) });
}

function checkIfValid (target) {
    const targetId = Number(target.getAttribute('square-id')) || Number(target.parentNode.getAttribute('square-id'));
    const startId = Number(startPositionId);
    const piece = draggedElement.id;

    switch (piece) {
        case 'pawn':
            const starterRow = [8, 9, 10, 11, 12, 13, 14, 15]
            if (starterRow.includes(startId) && (startId + width * 2 === targetId) && !document.querySelector(`[square-id="${targetId }"]`).firstChild && !document.querySelector(`[square-id="${startId + width }"]`).firstChild ||
            startId + width === targetId && !document.querySelector(`[square-id="${targetId}"]`).firstChild || 
            startId+width - 1 === targetId && document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild ||
            startId+width + 1 === targetId && document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild )
            {
                return true;
            }
            
            break;

        case 'knight':
            if (startId + width * 2 - 1 === targetId ||
                startId + width * 2 + 1 === targetId ||
                startId + width + 2 === targetId ||
                startId + width - 2 === targetId ||
                startId - width * 2 - 1 === targetId ||
                startId - width * 2 + 1 === targetId ||
                startId - width + 2 === targetId ||
                startId - width - 2 === targetId ) 
            {
                return true;
            }
        
            break;

        case 'bishop':
            if (startId + width + 1 === targetId ||
                startId + width * 2 + 2 === targetId && !document.querySelector(`[square-id="${startId + width + 1 }"]`).firstChild ||
                startId + width * 3 + 3 === targetId && !document.querySelector(`[square-id="${startId + width + 1 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *2 + 2 }"]`).firstChild ||
                startId + width * 4 + 4 === targetId && !document.querySelector(`[square-id="${startId + width + 1 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *2 + 2 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *3 + 3 }"]`).firstChild ||
                startId + width * 5 + 5 === targetId && !document.querySelector(`[square-id="${startId + width + 1 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *2 + 2 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *3 + 3 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *4 + 4 }"]`).firstChild||
                startId + width * 6 + 6 === targetId && !document.querySelector(`[square-id="${startId + width + 1 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *2 + 2 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *3 + 3 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *4 + 4 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *5 + 5 }"]`).firstChild||
                startId + width * 7 + 7 === targetId && !document.querySelector(`[square-id="${startId + width + 1 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *2 + 2 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *3 + 3 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *4 + 4 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *5 + 5 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *6 + 6 }"]`).firstChild ||
                // ---
                startId - width - 1 === targetId ||
                startId - width * 2 - 2 === targetId && !document.querySelector(`[square-id="${startId - width - 1 }"]`).firstChild ||
                startId - width * 3 - 3 === targetId && !document.querySelector(`[square-id="${startId - width - 1 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *2 - 2 }"]`).firstChild ||
                startId - width * 4 - 4 === targetId && !document.querySelector(`[square-id="${startId - width - 1 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *2 - 2 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *3 - 3 }"]`).firstChild ||
                startId - width * 5 - 5 === targetId && !document.querySelector(`[square-id="${startId - width - 1 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *2 - 2 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *3 - 3 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *4 - 4 }"]`).firstChild||
                startId - width * 6 - 6 === targetId && !document.querySelector(`[square-id="${startId - width - 1 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *2 - 2 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *3 - 3 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *4 - 4 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *5 - 5 }"]`).firstChild||
                startId - width * 7 - 7 === targetId && !document.querySelector(`[square-id="${startId - width - 1 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *2 - 2 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *3 - 3 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *4 - 4 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *5 - 5 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *6 - 6 }"]`).firstChild ||
                // ---
                startId - width + 1 === targetId ||
                startId - width * 2 + 2 === targetId && !document.querySelector(`[square-id="${startId - width + 1 }"]`).firstChild ||
                startId - width * 3 + 3 === targetId && !document.querySelector(`[square-id="${startId - width + 1 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *2 + 2 }"]`).firstChild ||
                startId - width * 4 + 4 === targetId && !document.querySelector(`[square-id="${startId - width + 1 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *2 + 2 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *3 + 3 }"]`).firstChild ||
                startId - width * 5 + 5 === targetId && !document.querySelector(`[square-id="${startId - width + 1 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *2 + 2 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *3 + 3 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *4 + 4 }"]`).firstChild||
                startId - width * 6 + 6 === targetId && !document.querySelector(`[square-id="${startId - width + 1 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *2 + 2 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *3 + 3 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *4 + 4 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *5 + 5 }"]`).firstChild||
                startId - width * 7 + 7 === targetId && !document.querySelector(`[square-id="${startId - width + 1 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *2 + 2 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *3 + 3 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *4 + 4 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *5 + 5 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *6 + 6 }"]`).firstChild ||
                // ---
                startId + width - 1 === targetId ||
                startId + width * 2 - 2 === targetId && !document.querySelector(`[square-id="${startId + width - 1 }"]`).firstChild ||
                startId + width * 3 - 3 === targetId && !document.querySelector(`[square-id="${startId + width - 1 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *2 - 2 }"]`).firstChild ||
                startId + width * 4 - 4 === targetId && !document.querySelector(`[square-id="${startId + width - 1 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *2 - 2 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *3 - 3 }"]`).firstChild ||
                startId + width * 5 - 5 === targetId && !document.querySelector(`[square-id="${startId + width - 1 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *2 - 2 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *3 - 3 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *4 - 4 }"]`).firstChild||
                startId + width * 6 - 6 === targetId && !document.querySelector(`[square-id="${startId + width - 1 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *2 - 2 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *3 - 3 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *4 - 4 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *5 - 5 }"]`).firstChild||
                startId + width * 7 - 7 === targetId && !document.querySelector(`[square-id="${startId + width - 1 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *2 - 2 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *3 - 3 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *4 - 4 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *5 - 5 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *6 - 6 }"]`).firstChild
                
            ) {
                return true;
            }
            break;

        case 'rook':
            if (startId + width === targetId || 
                startId + width * 2  === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild ||
                startId + width * 3  === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild && !document.querySelector(`[square-id="${startId + width *2 }"]`).firstChild ||
                startId + width * 4  === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild && !document.querySelector(`[square-id="${startId + width *2 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *3 }"]`).firstChild ||
                startId + width * 5  === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild && !document.querySelector(`[square-id="${startId + width *2 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *3 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 }"]`).firstChild||
                startId + width * 6  === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild && !document.querySelector(`[square-id="${startId + width *2 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *3 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 5 }"]`).firstChild||
                startId + width * 7  === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild && !document.querySelector(`[square-id="${startId + width *2 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *3 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 5 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 6}"]`).firstChild ||
                // ---
                startId - width === targetId || 
                startId - width * 2  === targetId && !document.querySelector(`[square-id="${startId - width }"]`).firstChild ||
                startId - width * 3  === targetId && !document.querySelector(`[square-id="${startId - width }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *2 }"]`).firstChild ||
                startId - width * 4  === targetId && !document.querySelector(`[square-id="${startId - width }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *2 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *3 }"]`).firstChild ||
                startId - width * 5  === targetId && !document.querySelector(`[square-id="${startId - width }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *2 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *3 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 }"]`).firstChild||
                startId - width * 6  === targetId && !document.querySelector(`[square-id="${startId - width }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *2 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *3 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 5 }"]`).firstChild||
                startId - width * 7  === targetId && !document.querySelector(`[square-id="${startId - width }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *2 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *3 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 5 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 6 }"]`).firstChild ||
                // ---
                startId + 1 === targetId || 
                startId + 2 === targetId && !document.querySelector(`[square-id="${startId + 1 }"]`).firstChild ||
                startId + 3 === targetId && !document.querySelector(`[square-id="${startId + 1 }"]`).firstChild && !document.querySelector(`[square-id="${startId + 2 }"]`).firstChild ||
                startId + 4 === targetId && !document.querySelector(`[square-id="${startId + 1 }"]`).firstChild && !document.querySelector(`[square-id="${startId + 2 }"]`).firstChild && !document.querySelector(`[square-id="${startId + 3 }"]`).firstChild ||
                startId + 5 === targetId && !document.querySelector(`[square-id="${startId + 1 }"]`).firstChild && !document.querySelector(`[square-id="${startId + 2 }"]`).firstChild && !document.querySelector(`[square-id="${startId + 3 }"]`).firstChild && !document.querySelector(`[square-id="${startId + 4 }"]`).firstChild||
                startId + 6 === targetId && !document.querySelector(`[square-id="${startId + 1 }"]`).firstChild && !document.querySelector(`[square-id="${startId + 2 }"]`).firstChild && !document.querySelector(`[square-id="${startId + 3 }"]`).firstChild && !document.querySelector(`[square-id="${startId + 4 }"]`).firstChild && !document.querySelector(`[square-id="${startId + 5 }"]`).firstChild||
                startId + 7 === targetId && !document.querySelector(`[square-id="${startId + 1 }"]`).firstChild && !document.querySelector(`[square-id="${startId + 2 }"]`).firstChild && !document.querySelector(`[square-id="${startId + 3 }"]`).firstChild && !document.querySelector(`[square-id="${startId + 4 }"]`).firstChild && !document.querySelector(`[square-id="${startId + 5 }"]`).firstChild && !document.querySelector(`[square-id="${startId + 6 }"]`).firstChild ||
            
                startId - 1 === targetId ||
                startId - 2 === targetId && !document.querySelector(`[square-id="${startId -1 }"]`).firstChild ||
                startId - 3 === targetId && !document.querySelector(`[square-id="${startId -1 }"]`).firstChild && !document.querySelector(`[square-id="${startId - 2 }"]`).firstChild ||
                startId - 4 === targetId && !document.querySelector(`[square-id="${startId -1 }"]`).firstChild && !document.querySelector(`[square-id="${startId - 2 }"]`).firstChild && !document.querySelector(`[square-id="${startId - 3 }"]`).firstChild ||
                startId - 5 === targetId && !document.querySelector(`[square-id="${startId -1 }"]`).firstChild && !document.querySelector(`[square-id="${startId - 2 }"]`).firstChild && !document.querySelector(`[square-id="${startId - 3 }"]`).firstChild && !document.querySelector(`[square-id="${startId - 4 }"]`).firstChild||
                startId - 6 === targetId && !document.querySelector(`[square-id="${startId -1 }"]`).firstChild && !document.querySelector(`[square-id="${startId - 2 }"]`).firstChild && !document.querySelector(`[square-id="${startId - 3 }"]`).firstChild && !document.querySelector(`[square-id="${startId - 4 }"]`).firstChild && !document.querySelector(`[square-id="${startId - 5 }"]`).firstChild||
                startId - 7 === targetId && !document.querySelector(`[square-id="${startId -1 }"]`).firstChild && !document.querySelector(`[square-id="${startId - 2 }"]`).firstChild && !document.querySelector(`[square-id="${startId - 3 }"]`).firstChild && !document.querySelector(`[square-id="${startId - 4 }"]`).firstChild && !document.querySelector(`[square-id="${startId - 5 }"]`).firstChild && !document.querySelector(`[square-id="${startId - 6 }"]`).firstChild 
                // ---
                ) {
                    return true;
                }
                break;

            case 'queen':
                if (startId + width === targetId || 
                    startId + width * 2  === targetId && !document.querySelector(`[square-id="${startId + width }"]`).firstChild ||
                    startId + width * 3  === targetId && !document.querySelector(`[square-id="${startId + width }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *2 }"]`).firstChild ||
                    startId + width * 4  === targetId && !document.querySelector(`[square-id="${startId + width }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *2 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *3  }"]`).firstChild ||
                    startId + width * 5  === targetId && !document.querySelector(`[square-id="${startId + width }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *2 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *3  }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *4 }"]`).firstChild ||
                    startId + width * 6  === targetId && !document.querySelector(`[square-id="${startId + width }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *2 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *3  }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *4 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *5 }"]`).firstChild ||
                    startId + width * 7  === targetId && !document.querySelector(`[square-id="${startId + width }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *2 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *3  }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *4 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *5 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *6 }"]`).firstChild ||
                    // ---
                    startId - width === targetId || 
                    startId - width * 2  === targetId && !document.querySelector(`[square-id="${startId - width }"]`).firstChild ||
                    startId - width * 3  === targetId && !document.querySelector(`[square-id="${startId - width }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *2 }"]`).firstChild ||
                    startId - width * 4  === targetId && !document.querySelector(`[square-id="${startId - width }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *2 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *3  }"]`).firstChild ||
                    startId - width * 5  === targetId && !document.querySelector(`[square-id="${startId - width }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *2 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *3  }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *4 }"]`).firstChild||
                    startId - width * 6  === targetId && !document.querySelector(`[square-id="${startId - width }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *2 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *3  }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *4 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *5 }"]`).firstChild||
                    startId - width * 7  === targetId && !document.querySelector(`[square-id="${startId - width }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *2 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *3  }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *4 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *5 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *6 }"]`).firstChild ||
                    // ---
                    startId + 1 === targetId || 
                    startId + 2 === targetId && !document.querySelector(`[square-id="${startId + 1 }"]`).firstChild ||
                    startId + 3 === targetId && !document.querySelector(`[square-id="${startId + 1 }"]`).firstChild && !document.querySelector(`[square-id="${startId + 2  }"]`).firstChild ||
                    startId + 4 === targetId && !document.querySelector(`[square-id="${startId + 1 }"]`).firstChild && !document.querySelector(`[square-id="${startId + 2  }"]`).firstChild && !document.querySelector(`[square-id="${startId + 3  }"]`).firstChild ||
                    startId + 5 === targetId && !document.querySelector(`[square-id="${startId + 1 }"]`).firstChild && !document.querySelector(`[square-id="${startId + 2  }"]`).firstChild && !document.querySelector(`[square-id="${startId + 3  }"]`).firstChild && !document.querySelector(`[square-id="${startId + 4 }"]`).firstChild||
                    startId + 6 === targetId && !document.querySelector(`[square-id="${startId + 1 }"]`).firstChild && !document.querySelector(`[square-id="${startId + 2  }"]`).firstChild && !document.querySelector(`[square-id="${startId + 3  }"]`).firstChild && !document.querySelector(`[square-id="${startId + 4 }"]`).firstChild && !document.querySelector(`[square-id="${startId + 5 }"]`).firstChild||
                    startId + 7 === targetId && !document.querySelector(`[square-id="${startId + 1 }"]`).firstChild && !document.querySelector(`[square-id="${startId + 2  }"]`).firstChild && !document.querySelector(`[square-id="${startId + 3  }"]`).firstChild && !document.querySelector(`[square-id="${startId + 4 }"]`).firstChild && !document.querySelector(`[square-id="${startId + 5 }"]`).firstChild && !document.querySelector(`[square-id="${startId + 6 }"]`).firstChild ||
                
                    startId - 1 === targetId ||
                    startId - 2 === targetId && !document.querySelector(`[square-id="${startId -1 }"]`).firstChild ||
                    startId - 3 === targetId && !document.querySelector(`[square-id="${startId -1  }"]`).firstChild && !document.querySelector(`[square-id="${startId - 2 }"]`).firstChild ||
                    startId - 4 === targetId && !document.querySelector(`[square-id="${startId -1  }"]`).firstChild && !document.querySelector(`[square-id="${startId - 2 }"]`).firstChild && !document.querySelector(`[square-id="${startId - 3  }"]`).firstChild ||
                    startId - 5 === targetId && !document.querySelector(`[square-id="${startId -1  }"]`).firstChild && !document.querySelector(`[square-id="${startId - 2 }"]`).firstChild && !document.querySelector(`[square-id="${startId - 3  }"]`).firstChild && !document.querySelector(`[square-id="${startId - 4 }"]`).firstChild||
                    startId - 6 === targetId && !document.querySelector(`[square-id="${startId -1  }"]`).firstChild && !document.querySelector(`[square-id="${startId - 2 }"]`).firstChild && !document.querySelector(`[square-id="${startId - 3  }"]`).firstChild && !document.querySelector(`[square-id="${startId - 4 }"]`).firstChild && !document.querySelector(`[square-id="${startId - 5 }"]`).firstChild||
                    startId - 7 === targetId && !document.querySelector(`[square-id="${startId -1  }"]`).firstChild && !document.querySelector(`[square-id="${startId - 2 }"]`).firstChild && !document.querySelector(`[square-id="${startId - 3  }"]`).firstChild && !document.querySelector(`[square-id="${startId - 4 }"]`).firstChild && !document.querySelector(`[square-id="${startId - 5 }"]`).firstChild && !document.querySelector(`[square-id="${startId - 6 }"]`).firstChild ||
                    // ---
                    startId + width + 1 === targetId ||
                    startId + width * 2 + 2 === targetId && !document.querySelector(`[square-id="${startId + width + 1 }"]`).firstChild ||
                    startId + width * 3 + 3 === targetId && !document.querySelector(`[square-id="${startId + width + 1 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *2 + 2 }"]`).firstChild ||
                    startId + width * 4 + 4 === targetId && !document.querySelector(`[square-id="${startId + width + 1 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *2 + 2 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *3 + 3 }"]`).firstChild ||
                    startId + width * 5 + 5 === targetId && !document.querySelector(`[square-id="${startId + width + 1 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *2 + 2 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *3 + 3 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *4 + 4 }"]`).firstChild||
                    startId + width * 6 + 6 === targetId && !document.querySelector(`[square-id="${startId + width + 1 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *2 + 2 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *3 + 3 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *4 + 4 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *5 + 5 }"]`).firstChild||
                    startId + width * 7 + 7 === targetId && !document.querySelector(`[square-id="${startId + width + 1 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *2 + 2 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *3 + 3 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *4 + 4 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *5 + 5 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *6 + 6 }"]`).firstChild ||
                    // ---
                    startId - width - 1 === targetId ||
                    startId - width * 2 - 2 === targetId && !document.querySelector(`[square-id="${startId - width - 1 }"]`).firstChild ||
                    startId - width * 3 - 3 === targetId && !document.querySelector(`[square-id="${startId - width - 1 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *2 - 2 }"]`).firstChild ||
                    startId - width * 4 - 4 === targetId && !document.querySelector(`[square-id="${startId - width - 1 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *2 - 2 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *3 - 3 }"]`).firstChild ||
                    startId - width * 5 - 5 === targetId && !document.querySelector(`[square-id="${startId - width - 1 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *2 - 2 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *3 - 3 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *4 - 4 }"]`).firstChild||
                    startId - width * 6 - 6 === targetId && !document.querySelector(`[square-id="${startId - width - 1 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *2 - 2 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *3 - 3 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *4 - 4 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *5 - 5 }"]`).firstChild||
                    startId - width * 7 - 7 === targetId && !document.querySelector(`[square-id="${startId - width - 1 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *2 - 2 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *3 - 3 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *4 - 4 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *5 - 5 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *6 - 6 }"]`).firstChild ||
                    // ---
                    startId - width + 1 === targetId ||
                    startId - width * 2 + 2 === targetId && !document.querySelector(`[square-id="${startId - width + 1 }"]`).firstChild ||
                    startId - width * 3 + 3 === targetId && !document.querySelector(`[square-id="${startId - width + 1 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *2 + 2 }"]`).firstChild ||
                    startId - width * 4 + 4 === targetId && !document.querySelector(`[square-id="${startId - width + 1 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *2 + 2 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *3 + 3 }"]`).firstChild ||
                    startId - width * 5 + 5 === targetId && !document.querySelector(`[square-id="${startId - width + 1 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *2 + 2 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *3 + 3 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *4 + 4 }"]`).firstChild||
                    startId - width * 6 + 6 === targetId && !document.querySelector(`[square-id="${startId - width + 1 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *2 + 2 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *3 + 3 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *4 + 4 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *5 + 5 }"]`).firstChild||
                    startId - width * 7 + 7 === targetId && !document.querySelector(`[square-id="${startId - width + 1 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *2 + 2 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *3 + 3 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *4 + 4 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *5 + 5 }"]`).firstChild && !document.querySelector(`[square-id="${startId - width *6 + 6 }"]`).firstChild ||
                    // ---
                    startId + width - 1 === targetId ||
                    startId + width * 2 - 2 === targetId && !document.querySelector(`[square-id="${startId + width - 1 }"]`).firstChild ||
                    startId + width * 3 - 3 === targetId && !document.querySelector(`[square-id="${startId + width - 1 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *2 - 2 }"]`).firstChild ||
                    startId + width * 4 - 4 === targetId && !document.querySelector(`[square-id="${startId + width - 1 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *2 - 2 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *3 - 3 }"]`).firstChild ||
                    startId + width * 5 - 5 === targetId && !document.querySelector(`[square-id="${startId + width - 1 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *2 - 2 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *3 - 3 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *4 - 4 }"]`).firstChild||
                    startId + width * 6 - 6 === targetId && !document.querySelector(`[square-id="${startId + width - 1 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *2 - 2 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *3 - 3 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *4 - 4 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *5 - 5 }"]`).firstChild||
                    startId + width * 7 - 7 === targetId && !document.querySelector(`[square-id="${startId + width - 1 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *2 - 2 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *3 - 3 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *4 - 4 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *5 - 5 }"]`).firstChild && !document.querySelector(`[square-id="${startId + width *6 - 6 }"]`).firstChild
                
                    ) {
                        return true;
                    }

            case 'king':
                if (startId + 1 === targetId || 
                    startId - 1 === targetId ||
                    startId + width === targetId ||
                    startId - width === targetId ||
                    startId + width - 1 === targetId ||
                    startId + width + 1 === targetId ||
                    startId - width - 1 === targetId ||
                    startId - width + 1 === targetId 
                ){
                    return true;
                }
    
        default:
            return false;
            break;
    }

}


function checkForWin () {
    const kings = Array.from(document.querySelectorAll('#king'));
    if (!kings.some(king => king.classList.contains('white'))) {
        infoDisplay.innerHTML = 'black Player wins'
        const allSquares = document.querySelectorAll('.square')
        allSquares.forEach(square => square.firstChild?.setAttribute('draggable', false))

        var audio = new Audio('sounds/notify.mp3');
        audio.play();
    }
    if (!kings.some(king => king.classList.contains('black'))) {
        infoDisplay.innerHTML = 'White Player wins'
        const allSquares = document.querySelectorAll('.square')
        allSquares.forEach(square => square.firstChild?.setAttribute('draggable', false))

        var audio = new Audio('sounds/notify.mp3');
        audio.play();
    }
}