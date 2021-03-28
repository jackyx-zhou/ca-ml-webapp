export default function GoL(n) {
    let cols = n;
    let rows = n;
    this.grid = make2DArrayRandom(cols, rows);

    this.computeNext = () => {
        let next = make2DArray(cols, rows);

        // Compute next based on grid
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                let state = this.grid[i][j];
                // Count live neighbors!
                let neighbors = countNeighbors(this.grid, i, j);

                if (state === 0 && neighbors === 3) {
                    next[i][j] = 1;
                } else if (state === 1 && (neighbors < 2 || neighbors > 3)) {
                    next[i][j] = 0;
                } else {
                    next[i][j] = state;
                }

            }
        }
        this.grid = next;
    }

    function countNeighbors(grid, x, y) {
        let sum = 0;
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                let col = (x + i + cols) % cols;
                let row = (y + j + rows) % rows;
                sum += grid[col][row];
            }
        }
        sum -= grid[x][y];
        return sum;
    }
}

function make2DArray(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows);
    }
    return arr;
}

function make2DArrayRandom(cols, rows) {
    let grid = make2DArray(cols, rows);
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j] = Math.floor(Math.random() * 2);
        }
    }
    return grid;
}