let rows = 30;
let cols = 50;

const gridContainer = document.getElementById('gridContainer');

let playing = false;

let grid = new Array(rows);
let nextGrid = new Array(rows);

let timer;
let reproductionTime = 100;


initialize();


// setup
function initialize() {
    createBoard();
    initializeGrids();
    resetGrids();
    setupControlButtons();
}

function createBoard() {
    gridContainer.style.gridTemplateColumns = "repeat(" + cols + ", 20px)";
    gridContainer.style.gridTemplateRows = "repeat(" + rows + ", 20px)";

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let cell = document.createElement("div");
            cell.classList.add("item");
            cell.setAttribute("id", "id" + i + "_" + j);
            cell.classList.add("dead");
            cell.onclick = cellClickHandler;
            gridContainer.appendChild(cell);
        }
    }
}

function cellClickHandler() {
    let rowcol = this.id.replace("id", "").split("_");
    let row = rowcol[0];
    let col = rowcol[1];

    let classes = this.getAttribute("class");
    if(classes.indexOf("live") > -1) {
        this.classList.remove("live");
        this.classList.add("dead");
        grid[row][col] = 0;
    } else {
        this.classList.remove("dead");
        this.classList.add("live");
        grid[row][col] = 1;
    }
}

function clearButtonHandler() {
    playing = false;
    let startButton = document.getElementById('start');
    startButton.innerHTML = "Start";
    clearTimeout(timer);

    let liveCells = document.getElementsByClassName("live");
    let cells = [];
    for (let i = 0; i < liveCells.length; i++) {
        cells.push(liveCells[i]);
    }

    for (let i = 0; i < cells.length; i++) {
        cells[i].classList.remove("live");
        cells[i].classList.add("dead");
    }
    resetGrids;
}

function randomButtonHandler() {
    if (playing) return;

    clearButtonHandler();

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let isLive = Math.round(Math.random());
            if (isLive) {
                let cell = document.getElementById("id" + i + "_" + j);
                cell.classList.remove("dead");
                cell.classList.add("live");
                grid[i][j] = 1;
            }
        }
    }
}

function startButtonHandler() {
    if (playing) {
        playing = false;
        this.innerHTML = "Continue";
        clearTimeout(timer);
    } else {
        playing = true;
        this.innerHTML = "Pause";
        play();
    }
}

function initializeGrids() {
    for (let i = 0; i < rows; i++) {
        grid[i] = new Array(cols);
        nextGrid[i] = new Array(cols);
    }
}

function resetGrids() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            grid[i][j] = 0;
            nextGrid[i][j] = 0;
        }
    }
}

function setupControlButtons() {
    let startButton = document.getElementById('start');
    startButton.onclick = startButtonHandler;

    let clearButton = document.getElementById('clear');
    clearButton.onclick = clearButtonHandler;

    let randomButton = document.getElementById("random");
    randomButton.onclick = randomButtonHandler;

    
    let decreaseXButton = document.getElementById('decreaseX');
    decreaseXButton.onclick = decreaseXButtonHandler;
    
    let increaseXButton = document.getElementById('increaseX');
    increaseXButton.onclick = increaseXButtonHandler;
    
    let decreaseYButton = document.getElementById('decreaseY');
    decreaseYButton.onclick = decreaseYButtonHandler;
    
    let increaseYButton = document.getElementById('increaseY');
    increaseYButton.onclick = increaseYButtonHandler;
}

function decreaseXButtonHandler() {
    clearButtonHandler();
    rows -= 1;
    gridContainer.innerHTML = "";
    initialize();
}

function increaseXButtonHandler() {
    clearButtonHandler();
    rows += 1;
    gridContainer.innerHTML = "";
    initialize();
}

function decreaseYButtonHandler() {
    clearButtonHandler();
    cols -= 1;
    gridContainer.innerHTML = "";
    initialize();
}

function increaseYButtonHandler() {
    clearButtonHandler();
    cols += 1;
    gridContainer.innerHTML = "";
    initialize();
}


// play
function play() {
    computeNextGen();

    if (playing) {
        timer = setTimeout(play, reproductionTime);
    }
}

function computeNextGen() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            applyRules(i, j);
        }
    }

    copyAndResetGrid();
    updateView();
}

function copyAndResetGrid() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = nextGrid[i][j];
            nextGrid[i][j] = 0;
        }
    }
}

function updateView() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let cell = document.getElementById("id" + i + "_" + j);

            if (grid[i][j] == 0) {
                cell.classList.remove("live");
                cell.classList.add("dead");
            } else {
                cell.classList.remove("dead");
                cell.classList.add("live");
            }
        }
    }
}

function applyRules(row, col) {
    let numNeighbors = countNeighbors(row, col);

    if (grid[row][col] == 1) { // if alive
        if (numNeighbors < 2) {
            nextGrid[row][col] = 0; // kill
        }
        else if (numNeighbors == 2 || numNeighbors == 3) {
            nextGrid[row][col] = 1; // spawn
        }
        else if (numNeighbors > 3) {
            nextGrid[row][col] = 0; // kill
        }
    } else if (grid[row][col] == 0) { // if dead
        if (numNeighbors == 3) {
            nextGrid[row][col] = 1; // spawn
        }
    }
}

function countNeighbors(row, col) {
    let count = 0;

    if (row-1 >= 0) {
        if (grid[row-1][col] == 1) count++;
    }

    if (row-1 >= 0 && col-1 >= 0) {
        if (grid[row-1][col-1] == 1) count++;
    }

    if (row-1 >= 0 && col+1 < cols) {
        if (grid[row-1][col+1] == 1) count++;
    }

    if (col-1 >= 0) {
        if (grid[row][col-1] == 1) count++;
    }

    if (col+1 < cols) {
        if (grid[row][col+1] == 1) count++;
    }

    if (row+1 < rows) {
        if (grid[row+1][col] == 1) count++;
    }

    if (row+1 < rows && col-1 >= 0) {
        if (grid[row+1][col-1] == 1) count++;
    }

    if (row+1 < rows && col+1 < cols) {
        if (grid[row+1][col+1] == 1) count++;
    }

    return count;
}