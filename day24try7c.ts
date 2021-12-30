const input=`inp w
mul x 0
add x z
mod x 26
div z 1
add x 13
eql x w
eql x 0
mul y 0
add y 25
mul y x
add y 1
mul z y
mul y 0
add y w
add y 13
mul y x
add z y
inp w
mul x 0
add x z
mod x 26
div z 1
add x 11
eql x w
eql x 0
mul y 0
add y 25
mul y x
add y 1
mul z y
mul y 0
add y w
add y 10
mul y x
add z y
inp w
mul x 0
add x z
mod x 26
div z 1
add x 15
eql x w
eql x 0
mul y 0
add y 25
mul y x
add y 1
mul z y
mul y 0
add y w
add y 5
mul y x
add z y
inp w
mul x 0
add x z
mod x 26
div z 26
add x -11
eql x w
eql x 0
mul y 0
add y 25
mul y x
add y 1
mul z y
mul y 0
add y w
add y 14
mul y x
add z y
inp w
mul x 0
add x z
mod x 26
div z 1
add x 14
eql x w
eql x 0
mul y 0
add y 25
mul y x
add y 1
mul z y
mul y 0
add y w
add y 5
mul y x
add z y
inp w
mul x 0
add x z
mod x 26
div z 26
add x 0
eql x w
eql x 0
mul y 0
add y 25
mul y x
add y 1
mul z y
mul y 0
add y w
add y 15
mul y x
add z y
inp w
mul x 0
add x z
mod x 26
div z 1
add x 12
eql x w
eql x 0
mul y 0
add y 25
mul y x
add y 1
mul z y
mul y 0
add y w
add y 4
mul y x
add z y
inp w
mul x 0
add x z
mod x 26
div z 1
add x 12
eql x w
eql x 0
mul y 0
add y 25
mul y x
add y 1
mul z y
mul y 0
add y w
add y 11
mul y x
add z y
inp w
mul x 0
add x z
mod x 26
div z 1
add x 14
eql x w
eql x 0
mul y 0
add y 25
mul y x
add y 1
mul z y
mul y 0
add y w
add y 1
mul y x
add z y
inp w
mul x 0
add x z
mod x 26
div z 26
add x -6
eql x w
eql x 0
mul y 0
add y 25
mul y x
add y 1
mul z y
mul y 0
add y w
add y 15
mul y x
add z y
inp w
mul x 0
add x z
mod x 26
div z 26
add x -10
eql x w
eql x 0
mul y 0
add y 25
mul y x
add y 1
mul z y
mul y 0
add y w
add y 12
mul y x
add z y
inp w
mul x 0
add x z
mod x 26
div z 26
add x -12
eql x w
eql x 0
mul y 0
add y 25
mul y x
add y 1
mul z y
mul y 0
add y w
add y 8
mul y x
add z y
inp w
mul x 0
add x z
mod x 26
div z 26
add x -3
eql x w
eql x 0
mul y 0
add y 25
mul y x
add y 1
mul z y
mul y 0
add y w
add y 14
mul y x
add z y
inp w
mul x 0
add x z
mod x 26
div z 26
add x -5
eql x w
eql x 0
mul y 0
add y 25
mul y x
add y 1
mul z y
mul y 0
add y w
add y 9
mul y x
add z y`;

const inputEx = `inp w
add z w
mod z 2
div w 2
add y w
mod y 2
div w 2
add x w
mod x 2
div w 2
mod w 2`;

const inputMe = `inp w
add w 1
inp x
mul x w
div x 5`;

type Op = [string, string, number|string];
const ops = input.split('\n').map(r => r.split(' ').map(i => !isNaN(Number(i)) ? Number(i) : i) as Op);

type CondSet = [number,number][];
type ValueSet = Map<number, CondSet[]>;

function fixedValue(num: number): ValueSet {
    return new Map([[num, []]]);
}

let w = fixedValue(0);
let x = fixedValue(0);
let y = fixedValue(0);
let z = fixedValue(0);

let inpOffset = 0;

function uniq(nums: number[]): number[] {
    const set = new Set(nums);
    return [...set.values()];
}

function assignToReg(reg: string, value: ValueSet): void {
    switch (reg) {
        case 'w': w = value; return;
        case 'x': x = value; return;
        case 'y': y = value; return;
        case 'z': z = value; return;
    }
    throw 'invalid reg in assignToReg: ' + reg;
}

function getReg(reg: string): ValueSet {
    switch (reg) {
        case 'w': return w;
        case 'x': return x;
        case 'y': return y;
        case 'z': return z;
    }
    throw 'invalid reg in getReg: ' + reg;
}

const inpValids = [
    [1],
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [7, 8, 9],
    [1, 2, 3],
    [1, 2, 3, 4],
    [6, 7, 8, 9],
    [1, 2, 3, 4, 8, 9],
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [6, 7, 8, 9],
    [1, 2, 3, 4],
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
];

function getOperand(op: Op): ValueSet {
    if (op[0] === 'inp') {
        const inpNum = inpOffset++;
        return new Map(inpValids[inpNum].map(v => [v, [[[inpNum,v]]]]));
    }
    const operand = op[2];
    if (typeof operand === 'number') {
        return fixedValue(operand);
    }
    return getReg(operand);
}

function condSetIntersection(v1: CondSet[], v2: CondSet[]): CondSet[] | undefined {
    if (v1.length === 0) {
        return v2;
    }
    if (v2.length === 0) {
        return v1;
    }
    const ret: CondSet[] = [];
    for (const v1Set of v1) {
        for (const v2Set of v2) {
            const keys = uniq(v1Set.map(s => s[0]).concat(v2Set.map(s => s[0])));
            let newSet: CondSet = [];
            let broken = false;
            for (const key of keys) {
                const v1Key = v1Set.find(s => s[0] === key);
                const v2Key = v2Set.find(s => s[0] === key);
                if (!v1Key || !v2Key || v1Key[1] === v2Key[1]) {
                    newSet.push([key, v1Key ? v1Key[1] : v2Key![1]]);
                } else {
                    broken = true;
                    break;
                }
            }
            if (!broken) {
                ret.push(newSet);
            }
        }
    }
    // console.log("v1: ",v1, "v2: ", v2, "ret: ", ret);
    return ret.length > 0 ? ret : undefined;
}

function getFixedValue(v: ValueSet): number | undefined {
    if (v.size > 1) {
        return undefined;
    }
    const ent = [...v.entries()][0];
    if (ent[1].length === 0) {
        return ent[0];
    }
    return undefined;
}

// 19, 37, 55, 80
for (let opNum=0; opNum<ops.length; opNum++) {
// for (let opNum=0; opNum<80; opNum++) {
    const op = ops[opNum];    
    const reg = op[1];
    const regCont = getReg(reg);
    const operand = getOperand(op);
    let value: ValueSet;
    switch (op[0]) {
        case 'inp': {
            value = operand;
            break;
        }
        case 'add': {
            value = new Map();
            for (const [regVal, regCondSets] of regCont) {
                for (const [opVal, opCondSets] of operand) {
                    const intersect = condSetIntersection(regCondSets, opCondSets);
                    if (!intersect) {
                        continue;
                    }

                    const val = regVal + opVal;
                    if (value.has(val)) {
                        const more = value.get(val)!.concat(intersect);
                        value.set(val, more);
                    } else {
                        value.set(val, intersect);
                    }
                }
            }
            break;
        }
        case 'mul': {
            if (getFixedValue(operand) === 0) {
                // optimization
                value = fixedValue(0);
            } else {
                value = new Map();
                for (const [regVal, regCondSets] of regCont) {
                    for (const [opVal, opCondSets] of operand) {
                        const intersect = condSetIntersection(regCondSets, opCondSets);
                        if (!intersect) {
                            continue;
                        }
    
                        const val = regVal * opVal;
                        if (value.has(val)) {
                            const more = value.get(val)!.concat(intersect);
                            value.set(val, more);
                        } else {
                            value.set(val, intersect);
                        }
                    }
                }
            }
            break;
        }
        case 'div': {
            value = new Map();
            for (const [regVal, regCondSets] of regCont) {
                for (const [opVal, opCondSets] of operand) {
                    const intersect = condSetIntersection(regCondSets, opCondSets);
                    if (!intersect) {
                        continue;
                    }

                    if (opVal === 0) {
                        throw '/0';
                    }

                    const val = Math.trunc(regVal / opVal);
                    if (value.has(val)) {
                        value.set(val, value.get(val)!.concat(intersect));
                    } else {
                        value.set(val, intersect);
                    }
                }
            }
            break;
        }
        case 'mod': {
            value = new Map();
            for (const [regVal, regCondSets] of regCont) {
                for (const [opVal, opCondSets] of operand) {
                    const intersect = condSetIntersection(regCondSets, opCondSets);
                    if (!intersect) {
                        continue;
                    }

                    if (opVal === 0) {
                        throw '%0';
                    }

                    const val = regVal % opVal;
                    if (value.has(val)) {
                        value.set(val, value.get(val)!.concat(intersect));
                    } else {
                        value.set(val, intersect);
                    }
                }
            }
            break;
        }
        case 'eql': {
            value = new Map();
            for (const [regVal, regCondSets] of regCont) {
                for (const [opVal, opCondSets] of operand) {
                    const intersect = condSetIntersection(regCondSets, opCondSets);
                    if (!intersect) {
                        continue;
                    }

                    const val = (regVal === opVal) ? 1 : 0;
                    if (value.has(val)) {
                        value.set(val, value.get(val)!.concat(intersect));
                    } else {
                        value.set(val, intersect);
                    }
                }
            }
            break;
        }
        default:
            throw 'bad op: ' + op;
    }

// d    value.nums = uniq(value.nums);
// d    if (value.nums.length === 1) {
// d        value = fixedValue(value.nums[0]);
// d    }
    console.log(opNum + ':', op);

    // console.log(opNum + ':', op, ':', regCont, operand, ' => ');
    // console.dir(value, { depth: null });
    assignToReg(reg, value);
}

console.log('w:');
console.dir(w, { depth: null });
console.log('x:');
console.dir(x, { depth: null });
console.log('y:');
console.dir(y, { depth: null });
console.log('z:');
console.dir(z, { depth: null });
