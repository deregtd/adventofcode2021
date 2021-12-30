const input = `SNVVKOBFKOPBFFFCPBSF`;
const inputEx = `NNCB`;

const transform = `HH -> P
CH -> P
HK -> N
OS -> N
HV -> S
VC -> C
VO -> K
OC -> C
FB -> S
NP -> S
OK -> H
OO -> N
PP -> B
VK -> B
BV -> N
PN -> K
HC -> C
NS -> K
BO -> C
BN -> O
SP -> H
FK -> K
KF -> N
VP -> H
NO -> N
OH -> N
CC -> O
PK -> P
BF -> K
CP -> N
SH -> V
VS -> P
BH -> B
KS -> H
HB -> K
BK -> S
KV -> C
SF -> B
BB -> O
PC -> S
HN -> S
FP -> S
PH -> C
OB -> O
FH -> K
CS -> P
OF -> N
FF -> V
PV -> B
PF -> C
FC -> S
KC -> O
PS -> V
CO -> F
CK -> O
KH -> H
OP -> O
SK -> S
VB -> P
FN -> H
FS -> P
FV -> N
HP -> O
SB -> N
VN -> V
KK -> P
KO -> V
BC -> B
FO -> H
OV -> H
CF -> H
HF -> K
SS -> V
SC -> N
CB -> B
SV -> C
SN -> P
PB -> B
KP -> S
PO -> B
CN -> F
ON -> B
CV -> S
HO -> O
NF -> F
VH -> P
NN -> S
HS -> S
NV -> V
NH -> C
NB -> B
SO -> K
NC -> C
VF -> B
BS -> V
VV -> N
BP -> P
KN -> C
NK -> O
KB -> F`;
const transformEx = `CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C`;
const pairs = transform.split('\n').map(r => r.split(' -> '));
const pairLookup: {[key: string]: string} = {};
for (const pair of pairs) {
    pairLookup[pair[0]] = pair[1];
}

let countPairs: {[key: string]: number} = {};

for (let i=0; i<input.length-1; i++) {
    const check = input.substring(i, i+2);
    if (!(check in countPairs)) {
        countPairs[check] = 1;
    } else {
        countPairs[check]++;
    }
}

for (let i=0; i<40; i++) {
    let newCountPairs: {[key: string]: number} = {};
    for (const pair of Object.keys(countPairs)) {
        let outPairs: [string, number][] = [];
        if (pair in pairLookup) {
            // const newStr = pair.substring(0,1) + pairs[pair][1] + pair.substring(1, 2);
            outPairs.push([pair.substring(0,1) + pairLookup[pair], countPairs[pair]]);
            outPairs.push([pairLookup[pair] + pair.substring(1, 2), countPairs[pair]]);
        } else {
            outPairs.push([pair, countPairs[pair]]);
        }

        for (const outPair of outPairs) {
            if (outPair[0] in newCountPairs) {
                newCountPairs[outPair[0]] += outPair[1];
            } else {
                newCountPairs[outPair[0]] = outPair[1];
            }
        }
    }
    countPairs = newCountPairs;
}

console.log(countPairs);

let countChars: {[key: string]: number} = {};
for (const pair of Object.entries(countPairs)) {
    const char = pair[0].substring(0, 1);
    if (!(char in countChars)) {
        countChars[char] = pair[1];
    } else {
        countChars[char] += pair[1];
    }
}
countChars[input.substring(input.length - 1)]++;

console.log(countChars);