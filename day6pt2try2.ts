const rawFish = [5,1,1,1,3,5,1,1,1,1,5,3,1,1,3,1,1,1,4,1,1,1,1,1,2,4,3,4,1,5,3,4,1,1,5,1,2,1,1,2,1,1,2,1,1,4,2,3,2,1,4,1,1,4,2,1,4,5,5,1,1,1,1,1,2,1,1,1,2,1,5,5,1,1,4,4,5,1,1,1,3,1,5,1,2,1,5,1,4,1,3,2,4,2,1,1,4,1,1,1,1,4,1,1,1,1,1,3,5,4,1,1,3,1,1,1,2,1,1,1,1,5,1,1,1,4,1,4,1,1,1,1,1,2,1,1,5,1,2,1,1,2,1,1,2,4,1,1,5,1,3,4,1,2,4,1,1,1,1,1,4,1,1,4,2,2,1,5,1,4,1,1,5,1,1,5,5,1,1,1,1,1,5,2,1,3,3,1,1,1,3,2,4,5,1,2,1,5,1,4,1,5,1,1,1,1,1,1,4,3,1,1,3,3,1,4,5,1,1,4,1,4,3,4,1,1,1,2,2,1,2,5,1,1,3,5,2,1,1,1,1,1,1,1,4,4,1,5,4,1,1,1,1,1,2,1,2,1,5,1,1,3,1,1,1,1,1,1,1,1,1,1,2,1,3,1,5,3,3,1,1,2,4,4,1,1,2,1,1,3,1,1,1,1,2,3,4,1,1,2];

let fishCounts = new Array<number>(9);
for (let i=0; i<9; i++) {
    fishCounts[i] = 0;
}

for (let i=0; i<rawFish.length; i++) {
    fishCounts[rawFish[i]]++;
}

function runDay() {
    let newCounts = new Array<number>(9);
        for (let i=1; i<9; i++) {
        newCounts[i-1] = fishCounts[i];
    }
    newCounts[6] += fishCounts[0];
    newCounts[8] = fishCounts[0];
    fishCounts = newCounts;
}

for (let i=0; i<256; i++) {
    console.log(i, fishCounts, fishCounts.reduce((prev, cur) => prev + cur));
    runDay();
}

console.log(fishCounts.reduce((prev, cur) => prev + cur));
