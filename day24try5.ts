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

const inputSub = `inp w
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

type Op = [string, string, number|string];
const ops = input.split('\n').map(r => r.split(' ').map(i => !isNaN(Number(i)) ? Number(i) : i) as Op);

interface CalcValue {
    min: number;
    max: number;
    value: string;
}

function fixedValue(num: number): CalcValue {
    return { min: num, max: num, value: num.toString() };
}

let w = fixedValue(0);
let x = fixedValue(0);
let y = fixedValue(0);
let z = fixedValue(0);

let inpOffset = 0;

function assignToReg(reg: string, value: CalcValue): void {
    if (value.max < value.min) {
        throw 'max < min';
    }
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

function isInputOnly(value: string): boolean {
    if (!value.startsWith('inp(') || !(value.endsWith(')'))) {
        return false;
    }
    value = value.substring(4, value.length - 1);
    return !isNaN(Number(value));
}

function getOperand(op: Op): CalcValue {
    if (op[0] === 'inp') {
        const value = 'inp(' + inpOffset + ')'
        inpOffset++;
        return { min: 1, max: 9, value: value };
    }
    const operand = op[2];
    if (typeof operand === 'number') {
        return fixedValue(operand);
    }
    return getReg(operand);
}

for (let opNum=0; opNum<ops.length; opNum++) {
// for (let opNum=0; opNum<80; opNum++) {
    const op = ops[opNum];    
    const reg = op[1];
    const regCont = getReg(reg);
    const operand = getOperand(op);
    let value: CalcValue;
    switch (op[0]) {
        case 'inp': {
            value = operand;
            break;
        }
        case 'add': {
            if (!isNaN(Number(regCont.value)) && !isNaN(Number(operand.value))) {
                value = fixedValue(Number(regCont.value) + Number(operand.value));
            } else if (operand.value === '0') {
                value = regCont;
            } else if (regCont.value === '0') {
                value = operand;
            } else {
                value = {
                    min: regCont.min + operand.min,
                    max: regCont.max + operand.max,
                    value: '(' + regCont.value + ') + (' + operand.value + ')'
                }
            }
            break;
        }
        case 'mul': {
            if (!isNaN(Number(regCont.value)) && !isNaN(Number(operand.value))) {
                value = fixedValue(Number(regCont.value) * Number(operand.value));
            } else if (operand.value === '1') {
                value = regCont;
            } else if (operand.value === '0' || regCont.value === '0') {
                value = fixedValue(0);
            } else {
                value = {
                    min: regCont.min * operand.min,
                    max: regCont.max * operand.max,
                    value: '(' + regCont.value + ') * (' + operand.value + ')'
                }
            }
            break;
        }
        case 'div': {
            if (!isNaN(Number(regCont.value)) && !isNaN(Number(operand.value))) {
                value = fixedValue(Math.trunc(Number(regCont.value) / Number(operand.value)));
            } else if (regCont.value === '0') {
                value = regCont;
            } else if (operand.value === '1') {
                value = regCont;
            } else {
                value = {
                    min: Math.trunc(regCont.min / operand.max),
                    max: Math.trunc(regCont.max / operand.min),
                    value: '(' + regCont.value + ') / (' + operand.value + ')'
                }
            }
            break;
        }
        case 'mod': {
            if (!isNaN(Number(regCont.value)) && !isNaN(Number(operand.value))) {
                value = fixedValue(Number(regCont.value) % Number(operand.value));
            } else if (regCont.value === '0') {
                value = regCont;
            } else if (operand.value === '1') {
                value = regCont;
            } else {
                if (operand.min < 1) {
                    throw 'minoperand%';
                }

                let min = regCont.min;
                let max = regCont.max;
                if (min <= -operand.max) {
                    // wraps through negative region
                    min = -operand.max + 1;
                    max = Math.max(0, max);
                }
                if (max >= operand.max) {
                    min = Math.min(min, 0);
                    max = operand.max - 1;
                }

                value = {
                    min,
                    max,
                    value: '(' + regCont.value + ') % (' + operand.value + ')'
                }
            }
            break;
        }
        case 'eql': {
            if (!isNaN(Number(regCont.value)) && !isNaN(Number(operand.value))) {
                value = fixedValue((Number(regCont.value) === Number(operand.value)) ? 1 : 0);
            } else if (regCont.value === operand.value) {
                value = fixedValue(1);
            } else if ((regCont.max < operand.min) || (operand.max < regCont.min)) {
                // no overlap
                value = fixedValue(0);
            } else {
                value = {
                    min: 0,
                    max: 1,
                    value: '(' + regCont.value + ') == (' + operand.value + ')'
                }
            }
            break;
        }
        default:
            throw 'bad op: ' + op;
    }
    console.log(opNum + ':', op, ':', regCont, operand, ' => ', value);
    assignToReg(reg, value);
}

console.log('w: ', w);
console.log('x: ', x);
console.log('y: ', y);
console.log('z: ', z);
