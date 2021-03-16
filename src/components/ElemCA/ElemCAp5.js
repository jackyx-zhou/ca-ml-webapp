import p5 from 'p5';

export default function ElemCAp5(parent, ruleNum) {
    const n = 64;
    const s = (sketch) => {
        function CA(ruleNum) {
            this.w = Math.floor(sketch.width / n);
            this.cells = new Array(n);
            for (let i = 0; i < this.cells.length; i++) {
                this.cells[i] = 0;
            }
            // We arbitrarily start with just the middle cell having a state of "1"
            this.cells[this.cells.length / 2] = 1;
            this.generation = 0;
            this.ruleset = ruleNum.toString(2).padStart(8, '0').split('').map(x => parseInt(x));

            this.generate = () => {
                // First we create an empty array filled with 0s for the new values
                var nextgen = [];
                for (let i = 0; i < this.cells.length; i++) {
                    nextgen[i] = 0;
                }
                // For every spot, determine new state by examing current state, and neighbor states
                // Ignore edges that only have one neighor
                for (let i = 1; i < this.cells.length - 1; i++) {
                    var left = this.cells[i - 1];   // Left neighbor state
                    var me = this.cells[i];     // Current state
                    var right = this.cells[i + 1];   // Right neighbor state
                    nextgen[i] = this.rules(left, me, right); // Compute next generation state based on ruleset
                }
                // The current generation is the new generation
                this.cells = nextgen;
                this.generation++;
            };

            this.display = function () {
                for (var i = 0; i < this.cells.length; i++) {
                    if (this.cells[i] === 1) sketch.fill(200);
                    else sketch.fill(51);
                    sketch.noStroke();
                    sketch.rect(i * this.w, this.generation * this.w, this.w, this.w);
                }
            };

            this.rules = function (a, b, c) {
                if (a === 1 && b === 1 && c === 1) return this.ruleset[0];
                if (a === 1 && b === 1 && c === 0) return this.ruleset[1];
                if (a === 1 && b === 0 && c === 1) return this.ruleset[2];
                if (a === 1 && b === 0 && c === 0) return this.ruleset[3];
                if (a === 0 && b === 1 && c === 1) return this.ruleset[4];
                if (a === 0 && b === 1 && c === 0) return this.ruleset[5];
                if (a === 0 && b === 0 && c === 1) return this.ruleset[6];
                if (a === 0 && b === 0 && c === 0) return this.ruleset[7];
                return 0;
            };
        }

        // let x = 100;
        // let y = 100;

        let ca;
        sketch.setup = () => {
            sketch.createCanvas(0.8 * parent.offsetWidth, 0.8 * parent.offsetWidth);
            ca = new CA(ruleNum);
            sketch.resizeCanvas(n * ca.w, n * ca.w);
            sketch.background(0);
        };

        sketch.draw = () => {
            ca.display();
            if (ca.generation < sketch.height / ca.w) {
                ca.generate();
            }
        };

        sketch.windowResized = () => {
            sketch.resizeCanvas(0.8 * parent.offsetWidth, 0.8 * parent.offsetWidth);
            ca = new CA(ruleNum);
            sketch.resizeCanvas(n * ca.w, n * ca.w);
            sketch.background(0);
        }
    };

    let elemp5 = new p5(s, parent);
    return elemp5;
}