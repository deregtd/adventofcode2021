const input = `1553421288
5255384882
1224315732
4258242274
1658564216
6872651182
5775552238
5622545172
8766672318
2178374835`;

const inputSample = `5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526`;

const inputSample2 = `11111
19991
19191
19991
11111`;

const octs = input.split('\n').map(r => r.split('').map(i => Number(i)));

let flashedThisStep: number[][] = [];

function flash(x: number, y: number) {
    const alreadyFlashed = flashedThisStep.find(p => p[0] === x && p[1] === y);
    if (alreadyFlashed) {
        return;
    }
    flashedThisStep.push([x, y]);
    let opts = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
    for (const opt of opts) {
        let nx = x + opt[0], ny = y + opt[1];
        if (nx < 0 || ny < 0 || nx >= octs[0].length || ny >= octs.length) {
            continue;
        }
        octs[ny][nx]++;
        if (octs[ny][nx] > 9) {
            flash(nx, ny);
        }
    }
}

function step(): number {
    for (let y=0; y<octs.length; y++) {
        for (let x=0; x<octs[0].length; x++) {
            octs[y][x]++;
        }
    }

    for (let y=0; y<octs.length; y++) {
        for (let x=0; x<octs[0].length; x++) {
            if (octs[y][x] > 9) {
                flash(x, y);
            }
        }
    }

    const flashes = flashedThisStep.length;
    // console.log(flashedThisStep);
    flashedThisStep.forEach(coord => {
        octs[coord[1]][coord[0]] = 0;
    })
    flashedThisStep = [];
    return flashes;
}

let i: number;
for (i=1; ;i++) {
    if (step() === octs.length*octs[0].length) {
        break;
    }
}

console.log(octs);
console.log(i);
