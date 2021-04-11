import p5 from 'p5';
import GoL from "./GoL"

export default function GoLp5(parent, staticGrid=null) {
    const n = 28;
    const cols = n, rows = n;
    let cellWidth;

    if (!staticGrid) {
        this.gol= new GoL(n);
    }
    this.isRunning = false;

    const s = (sketch) => {
        sketch.setup = () => {
            sketch.createCanvas(0.6 * parent.offsetWidth, 0.6 * parent.offsetWidth);
            cellWidth = sketch.width / n;
            sketch.resizeCanvas(n * cellWidth, n * cellWidth);
            sketch.background(0);
            sketch.frameRate(15);
        };

        sketch.draw = () => {
            sketch.background(255);
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    let x = i * cellWidth;
                    let y = j * cellWidth;
                    if (!staticGrid) {
                        if (this.gol.grid[i][j] === 1) {
                            sketch.fill(0);
                            sketch.noStroke();
                        } else {
                            sketch.noFill();
                            sketch.strokeWeight(2);
                            sketch.stroke(0);
                        }
                    } else {
                        const gray = 255 - sketch.map(staticGrid[i][j], 0, 1, 0, 255)
                        sketch.fill(gray);
                        sketch.strokeWeight(0.5);
                        sketch.stroke(128)
                    }
                    sketch.rect(x, y, cellWidth, cellWidth);
                }
            }

            if (this.isRunning) {
                this.gol.computeNext();
            }
        }

        sketch.mouseClicked = () => {
            if (!this.isRunning && !staticGrid) {
                let clickedX = Math.floor(sketch.mouseX / cellWidth)
                let clickedY =  Math.floor(sketch.mouseY / cellWidth)
                if (clickedX > 0 && clickedX < rows && clickedY > 0 && clickedY < cols) {
                    // Flip between 0 and 1
                    this.gol.grid[clickedX][clickedY] = 1 - this.gol.grid[clickedX][clickedY];
                }
            }
        }

        sketch.mouseDragged = () => {
            if (!this.isRunning && !staticGrid) {
                let clickedX = Math.floor(sketch.mouseX / cellWidth)
                let clickedY =  Math.floor(sketch.mouseY / cellWidth)
                if (clickedX > 0 && clickedX < rows && clickedY > 0 && clickedY < cols) {
                    this.gol.grid[clickedX][clickedY] = 1;
                }
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

    this.reset = () => {
        this.gol = new GoL(n);
    }
}