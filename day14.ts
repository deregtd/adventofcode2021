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

let str = input;
for (let i=0; i<10; i++) {
    for (let h=0; h<str.length; h++) {
        const check = str.substring(h, h+2);
        for (const pair of pairs) {
            if (check === pair[0]) {
                str = str.substring(0, h + 1) + pair[1] + str.substring(h+1);
                h++;
                break;
            }
        }
    }
}

let counts: {[key: string]: number} = {};
for (let i=0; i<str.length; i++) {
    const char = str.substring(i, i+1);
    if (!(char in counts)) {
        counts[char] = 1;
    } else {
        counts[char]++;
    }
}

console.log(counts);