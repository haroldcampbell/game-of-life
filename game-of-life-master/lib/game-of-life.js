// The worlds simplest assertion library
function assert (is, should, message){
    if (JSON.stringify(is) === JSON.stringify(should)) {
        return;
    }
    if (message === undefined) {
        throw `assert failed: ${is} != ${should}`
    }
    else {
        throw `assert failed: ${message}: ${is} != ${should}`
    }
}

assert(1, 1, "numbers should match");

let isCellAlive = (cell) => {
    return cell == 1
}

assert(isCellAlive(1), true, "cell should be dead")

function getRow(r, cells) {
    if(r < 0) {
        r = cells.length -1
    }
    if(r == cells.length) {
        r = 0;
    }
    return cells[r];
}

assert(getRow(1, [[1,1,1], [2,2,2], [3,3,3]]), [2,2,2], "should return row (middle)");
assert(getRow(2, [[1,1,1], [2,2,2], [3,3,3]]), [3,3,3], "should return row (bottom)");
assert(getRow(-1, [[1,1,1], [2,2,2], [3,3,3]]), [3,3,3], "bounds-check: -1 should wrap to cells[end-row]");
const testCells = [[1,1,1], [2,2,2], [3,3,3]];
assert(getRow(testCells.length, testCells), [1,1,1], "bounds-check: lenght should wrap to cells[0th-row]");

function getColCell(c, row) {
    if(c < 0) {
        c = row.length -1
    }
    if(c == row.length) {
        c = 0;
    }
    return row[c];
}

assert(getColCell(1, [1,2,3]), 2, "should return col Cell");
assert(getColCell(-1, [1,2,3]), 3, "bounds-check: -1 should wrap to row[end]");
const testRow = [1,2,3];
assert(getColCell(testRow.length, testRow), 1, "bounds-check: length should wrap to row[0]");


let hasTwoHorizontalNeighbours = (rIndex, cIndex, cells) => {
    const row = getRow(rIndex, cells);
    const leftCell = getColCell(cIndex-1, row);
    const rightCell = getColCell(cIndex+1, row);

    return isCellAlive(leftCell) && isCellAlive(rightCell) ? true : false;
}

assert(hasTwoHorizontalNeighbours(1, 1, [[0,0,0], [1,0,1], [0,0,0]]), true, "2 horizontal adjacent cells");
assert(hasTwoHorizontalNeighbours(2, 1, [[0,0,0], [0,0,0], [1,0,1]]), true, "2 horizontal adjacent cells (bottom)");

let hasTwoVerticalNeighbours = (rIndex, cIndex, cells) => {
    const topRow = getRow(rIndex-1, cells);
    const botRow = getRow(rIndex+1, cells);
    
    const topCell = getColCell(cIndex, topRow);
    const botCell = getColCell(cIndex, botRow);

    return isCellAlive(topCell) && isCellAlive(botCell) ? true : false;
}

assert(hasTwoVerticalNeighbours(1, 1, [[0,1,0], [0,0,0], [0,1,0]]), true, "2 vertical adjacent cells");
assert(hasTwoVerticalNeighbours(1, 2, [[0,0,1], [0,0,0], [0,0,1]]), true, "2 vertical adjacent cells (end)");

let hasTwoLeftDialogNeighbours = (rIndex, cIndex, cells) => {
    const topRow = getRow(rIndex-1, cells);
    const botRow = getRow(rIndex+1, cells);
    
    const topLeftCell = getColCell(cIndex-1, topRow);
    const botRightCell = getColCell(cIndex+1, botRow);

    return isCellAlive(topLeftCell) && isCellAlive(botRightCell) ? true : false;
}
assert(hasTwoLeftDialogNeighbours(1, 1, [[1,0,0], [0,0,0], [0,0,1]]), true, "2 left diagonals cells");

let hasTwoRightDialogNeighbours = (rIndex, cIndex, cells) => {
    const topRow = getRow(rIndex-1, cells);
    const botRow = getRow(rIndex+1, cells);
    
    const topRightCell = getColCell(cIndex+1, topRow);
    const botLeftCell = getColCell(cIndex-1, botRow);

    return isCellAlive(topRightCell) && isCellAlive(botLeftCell) ? true : false;
}

assert(hasTwoRightDialogNeighbours(1, 1, [[0,0,1], [0,0,0], [1,0,0]]), true, "2 right diagonal cells");

function killCell(rIndex, cIndex, cells) {
    const row = getRow(rIndex, cells);
    row[cIndex] = 0;
    
    return cells;
}
assert(killCell(1, 1, [[0,0,0], [0,1,0], [0,0,0]]), [[0,0,0], [0,0,0], [0,0,0]], "should kill cell");
assert(killCell(2, 1, [[0,0,0], [0,0,0], [0,1,0]]), [[0,0,0], [0,0,0], [0,0,0]], "should kill cell (bot)");

function spawnCell(rIndex, cIndex, cells) {
    const row = getRow(rIndex, cells);
    row[cIndex] = 1;
    
    return cells;
}
assert(spawnCell(1, 1, [[0,0,0], [0,0,0], [0,0,0]]), [[0,0,0], [0,1,0], [0,0,0]], "should spawn cell");

function countAlive() {
    let count = 0;
    const args = [...arguments];
    
    args.forEach(cell => {
        if(isCellAlive(cell)) {
            count++;
        }    
    });
    
    return count;
}

assert(countAlive(1, 0, 0, 1), 2, "should count variadic arguments");

function getNeighbourAliveCount(rIndex, cIndex, cells) {
    const topRow = getRow(rIndex-1, cells);
    const row = getRow(rIndex, cells);
    const botRow = getRow(rIndex+1, cells);

    const topLeftCell = getColCell(cIndex-1, topRow);
    const topCell = getColCell(cIndex, topRow);
    const topRightCell = getColCell(cIndex+1, topRow);
    
    const leftCell = getColCell(cIndex-1, row);
    const rightCell = getColCell(cIndex+1, row);
    
    const botLeftCell = getColCell(cIndex-1, botRow);
    const botCell = getColCell(cIndex, botRow);
    const botRightCell = getColCell(cIndex+1, botRow);
    
    return countAlive(topLeftCell, topCell, topRightCell, leftCell, rightCell, botLeftCell, botCell, botRightCell);
}
assert(getNeighbourAliveCount(1, 1, [[0,1,0], [0,0,0], [0,0,0]], 1), 1, "should count topMiddle");
assert(getNeighbourAliveCount(1, 1, [[1,1,1], [0,0,0], [0,0,0]], 1), 3, "should count top");
assert(getNeighbourAliveCount(1, 1, [[0,0,0], [0,0,0], [1,1,1]], 1), 3, "should count bottom");
assert(getNeighbourAliveCount(1, 1, [[0,0,0], [0,0,1], [1,1,1]], 1), 4, "should count middle + bottom");
assert(getNeighbourAliveCount(1, 1, [[0,0,1], [0,0,1], [0,0,1]], 1), 3, "should count left vert");

 
function hasNeighbourCellCount(rIndex, cIndex, cells, cellCount) {
    return getNeighbourAliveCount(rIndex, cIndex, cells) == cellCount
}
assert(hasNeighbourCellCount(1, 1, [[0,1,0], [0,0,0], [0,0,0]], 1), true, "1 alive cell: topMiddle");
assert(hasNeighbourCellCount(1, 1, [[0,0,0], [0,0,0], [0,1,0]], 1), true, "1 alive cell: botMiddle");
assert(hasNeighbourCellCount(1, 1, [[0,0,0], [0,0,0], [0,0,0]], 0), true, "0 alive cells");

let cells = [
    [0, 1, 0], //r1
    [0, 1, 0], //r2
    [0, 1, 0], //r2
];

// rule 1: Any live cell with fewer than two live neighbours dies, as if by underpopulation.
function applyRule1(rIndex, cIndex, cells) {
    const row = cells[rIndex];
    const cell = row[cIndex];
   
    if( getNeighbourAliveCount(rIndex, cIndex, cells) < 2) {
        return true
    }
    
    return false;
}
assert(applyRule1(1, 1, [[0,0,0], [0,1,0], [0,0,0]]), true, "underpopulation: 0 live cells");
assert(applyRule1(1, 1, [[0,1,0], [0,1,0], [0,0,0]]), true, "underpopulation: >2 live cells");
assert(applyRule1(1, 1, [[0,1,1], [0,1,0], [0,0,0]]), false, "underpopulation: 2 live cells");

// rule 2: Any live cell with two or three live neighbours lives on to the next generation.
function applyRule2(rIndex, cIndex, cells) {
    const row = cells[rIndex];
    const cell = row[cIndex];
    
    if(hasNeighbourCellCount(rIndex, cIndex, cells, 2) || hasNeighbourCellCount(rIndex, cIndex, cells, 3)) {
        return true;
    }
    return false;
}
assert(applyRule2(1, 1, [[0,1,0], [0,1,0], [0,1,0]]), true, "2 neighbours: keep alive");
assert(applyRule2(1, 1, [[1,1,0], [0,1,0], [0,0,0]]), true, "2 neighbours: keep alive (top)");
assert(applyRule2(1, 1, [[1,1,1], [0,1,0], [0,0,0]]), true, "3 neighbours: keep alive (top)");
assert(applyRule2(1, 1, [[1,1,0], [0,1,0], [1,0,1]]), false, "4 neighbours should fail");
assert(applyRule2(1, 1, [[0,1,0], [0,1,0], [0,0,0]]), false, "1 neighbour should");
assert(applyRule2(1, 1, [[0,0,0], [0,1,0], [0,0,0]]), false, "0 neighbour should");

// rule 3: Any live cell with more than three live neighbours dies, as if by overpopulation.
function applyRule3(rIndex, cIndex, cells) {
    const row = cells[rIndex];
    const cell = row[cIndex];

    if(getNeighbourAliveCount(rIndex, cIndex, cells) > 3) {
        return true
    }
    
    return false;
}
assert(applyRule3(1, 1, [[1,1,1], [0,1,0], [0,1,0]]), true, "overpopulation: keep alive (hori)");
assert(applyRule3(1, 1, [[0,1,1], [0,1,1], [0,0,1]]), true, "overpopulation: keep alive (vert)");

// rule 4: Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
function applyRule4(rIndex, cIndex, cells) {
   const row = cells[rIndex];
    const cell = row[cIndex];

    if(getNeighbourAliveCount(rIndex, cIndex, cells) == 3) {
        return true//spawnCell(rIndex, cIndex, cells);
    }
    
    return false;
}
assert(applyRule4(1, 1, [[1,1,1], [0,0,0], [0,0,0]]), true, "reproduction: keep alive (hori)");
assert(applyRule4(1, 1, [[0,0,1], [0,0,1], [0,0,1]]), true, "reproduction: keep alive (vert)");

function automaton(cells) {
    let newCells = JSON.parse(JSON.stringify(cells));

    for(rIndex = 0; rIndex < cells.length; rIndex++) {
        let row = cells[rIndex];
        for(cIndex = 0; cIndex < row.length; cIndex++) {
        
            const row = cells[rIndex];
            const cell = row[cIndex];

            if(isCellAlive(cell)) {
                if(applyRule2(rIndex, cIndex, cells)) {
                    continue;
                }
                if(applyRule1(rIndex, cIndex, cells) || applyRule3(rIndex, cIndex, cells)) {
                    newCells = killCell(rIndex, cIndex, newCells);
                }
            } else {
                if(applyRule4(rIndex, cIndex, cells)) {
                    newCells = spawnCell(rIndex, cIndex, newCells);
                }
            }
        }
    }
    return newCells;
}

assert(automaton([
[0,0,0,0,0],
[0,0,1,0,0],
[0,0,1,0,0],
[0,0,1,0,0],
[0,0,0,0,0],
]),[
[0,0,0,0,0],
[0,0,0,0,0],
[0,1,1,1,0],
[0,0,0,0,0],
[0,0,0,0,0],
]);

assert(automaton([
[0,0,0,0,0],
[0,1,0,1,0],
[0,0,0,1,0],
[0,0,0,0,0],
[0,0,0,0,0],
]),[
[0,0,0,0,0],
[0,0,1,0,0],
[0,0,1,0,0],
[0,0,0,0,0],
[0,0,0,0,0],
]);

assert(automaton([
[0,0,0,0,0],
[0,1,1,1,0],
[0,1,0,1,0],
[0,1,1,1,0],
[0,0,0,0,0],
]),[
[0,0,1,0,0],
[0,1,0,1,0],
[1,0,0,0,1],
[0,1,0,1,0],
[0,0,1,0,0],
]);;


cells = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
];

function displayCells(cells) {
    for (rIndex = 0; rIndex < cells.length; rIndex++) {
        let row = cells[rIndex];
        console.log(row.join(""))
    }
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

async function gameOfLife(runs) {
    for (iterations = 0; iterations < runs; iterations++) {
        console.log('\033[0;0H');// reset to line 0, col 0

        displayCells(cells);
        cells = automaton(cells);

        await delay(1000)
    }
}

gameOfLife(10)

