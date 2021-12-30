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

type RawOp = [string, string, number|string];
const ops = input.split('\n').map(r => r.split(' ').map(i => !isNaN(Number(i)) ? Number(i) : i) as RawOp);

type CalcValue = Set<number>;

function fixedValue(num: number): CalcValue {
    return new Set([num]);
}

let w = fixedValue(0);
let x = fixedValue(0);
let y = fixedValue(0);
let z = fixedValue(0);

let inpOffset = 0;

function assignToReg(reg: string, value: CalcValue): void {
    switch (reg) {
        case 'w': w = value; return;
        case 'x': x = value; return;
        case 'y': y = value; return;
        case 'z': z = value; return;
    }
    throw 'invalid reg in assignToReg: ' + reg;
}

function getReg(reg: string): CalcValue {
    switch (reg) {
        case 'w': return w;
        case 'x': return x;
        case 'y': return y;
        case 'z': return z;
    }
    throw 'invalid reg in getReg: ' + reg;
}

function getOperand(op: RawOp): CalcValue {
    if (op[0] === 'inp') {
        const expr = 'inp(' + inpOffset + ')'
        inpOffset++;
        return new Set([1,2,3,4,5,6,7,8,9]);
    }
    const operand = op[2];
    if (typeof operand === 'number') {
        return fixedValue(operand);
    }
    return getReg(operand);
}

function runOp(op: string, regPre: CalcValue, operand: CalcValue): CalcValue {
    let value: CalcValue;
    switch (op) {
        case 'inp': {
            return operand;
        }
        case 'add': {
            value = new Set();
            for (const regN of regPre) {
                for (const opN of operand) {
                    value.add(regN + opN);
                }
            }
            return value;
        }
        case 'mul': {
            value = new Set();
            for (const regN of regPre) {
                for (const opN of operand) {
                    value.add(regN * opN);
                }
            }
            return value;
        }
        case 'div': {
            value = new Set();
            for (const regN of regPre) {
                for (const opN of operand) {
                    value.add(Math.trunc(regN / opN));
                }
            }
            return value;
        }
        case 'mod': {
            value = new Set();
            for (const regN of regPre) {
                for (const opN of operand) {
                    value.add(regN % opN);
                }
            }
            return value;
        }
        case 'eql': {
            value = new Set();
            for (const regN of regPre) {
                for (const opN of operand) {
                    value.add((regN === opN) ? 1 : 0);
                }
            }
            return value;
        }
        default:
            throw 'bad op: ' + op;
    }
}


// 19, 37, 55, 80
const opList = ops.map((opRaw, opNum) => {
    const reg = opRaw[1];
    const regCont = getReg(reg);
    const operand = getOperand(opRaw);

    const value = runOp(opRaw[0], regCont, operand);

    console.log(opNum + ':', opRaw);
    assignToReg(reg, value);

    return 4;
});

// console.log('w: ', w);
// console.log('x: ', x);
// console.log('y: ', y);
console.log('z: ', [...z.values()].sort((a, b) => a - b));

