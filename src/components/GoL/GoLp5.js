import p5 from 'p5';
import GoL from "./GoL"

export default function GoLp5(parent) {
    const n = 28;
    const cols = n, rows = n;
    let cellWidth;

    this.gol= new GoL(n);
    this.isRunning = true;

    const s = (sketch) => {
        sketch.setup = () => {
            sketch.createCanvas(0.6 * parent.offsetWidth, 0.6 * parent.offsetWidth);
            cellWidth = sketch.width / n;
            sketch.resizeCanvas(n * cellWidth, n * cellWidth);
            sketch.background(0);
            sketch.frameRate(15);
        };

        sketch.draw = () => {
            sketch.background(0);

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    let x = i * cellWidth;
                    let y = j * cellWidth;
                    if (this.gol.grid[i][j] === 1) {
                        sketch.fill(255);
                        sketch.noStroke();
                        sketch.rect(x, y, cellWidth, cellWidth);
                    }
                }
            }

            if (this.isRunning) {
                this.gol.computeNext();
            }
        }

        sketch.windowResized = () => {
            sketch.createCanvas(0.6 * parent.offsetWidth, 0.6 * parent.offsetWidth);
            cellWidth = sketch.width / n;
            sketch.resizeCanvas(n * cellWidth, n * cellWidth);
            sketch.background(0);
        }
    };

    this.p5 = new p5(s, parent);

    GoLp5.prototype.reset = () => {
        this.gol = new GoL(n);
    }
}