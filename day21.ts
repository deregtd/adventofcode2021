let dieCount = 0;
let die = 1;
function roll(): number {
    const ret = die;
    die++;
    if (die > 100) {
        die = 1;
    }
    dieCount++;
    return ret;
}

let pos = [8, 4];
let score = [0, 0];

function runTurn(player: number): void {
    const moves = roll() + roll() + roll();
    pos[player] += moves;
    while (pos[player] > 10) {
        pos[player] -= 10;
    }
    score[player] += pos[player];
}

let turn = 0;
while (score[0] < 1000 && score[1] < 1000) {
    runTurn(turn);
    turn ^= 1;
}

console.log(score);
console.log(pos);
console.log(dieCount);
console.log(die);

console.log(Math.min(...score) * dieCount);
