// outcome: [p1pos, p1score, p2pos, p2score, turn, universes]
type Outcome = [number, number, number, number, 0|1, number];

const MoveRolls = {
    3: 1,
    4: 3,
    5: 6,
    6: 7,
    7: 6,
    8: 3,
    9: 1,
};

function mergeOutcome(outcome: Outcome, list: Outcome[]): void {
    for (let i=0; i<list.length; i++) {
        let found = true;
        for (let h=0; h<=4; h++) {
            if (list[i][h] !== outcome[h]) {
                found = false;
                break;
            }
        }
        if (found) {
            list[i][5] += outcome[5];
            return;
        }
    }
    list.push(outcome);
}

let finalOutcomes: Outcome[] = [];

let pendingOutcomes: Outcome[] = [[8, 0, 4, 0, 0, 1]];
while (pendingOutcomes.length > 0) {
    console.log(pendingOutcomes);
    let nextOutcomes: Outcome[] = [];
    for (const outcome of pendingOutcomes) {
        for (const pair of Object.entries(MoveRolls)) {
            let pos = (outcome[4] === 0) ? outcome[0] : outcome[2];
            let score = (outcome[4] === 0) ? outcome[1] : outcome[3];
            pos += Number(pair[0]);
            while (pos > 10) {
                pos -= 10;
            }
            score += pos;
        
            let nextOutcome: Outcome;
            if (outcome[4] === 0) {
                nextOutcome = [pos, score, outcome[2], outcome[3], 1, outcome[5] * pair[1]];
            } else {
                nextOutcome = [outcome[0], outcome[1], pos, score, 0, outcome[5] * pair[1]];
            }

            if (score >= 21) {
                // someone won
                mergeOutcome(nextOutcome, finalOutcomes);
            } else {
                mergeOutcome(nextOutcome, nextOutcomes);
            }
        }
    }
    pendingOutcomes = nextOutcomes;
}

let p1Wins = 0, p2Wins = 0;
for (const outcome of finalOutcomes) {
    if (outcome[4] === 1) {
        p1Wins += outcome[5];
    } else {
        p2Wins += outcome[5];
    }
}
console.log(p1Wins, p2Wins);