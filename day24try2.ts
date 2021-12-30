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

const ops = input.split('\n').splice(0, 37).map(r => r.split(' ').map(i => !isNaN(Number(i)) ? Number(i) : i) as [string, string, number|string]);

let w='0',x='0',y='0',z='0';
//let w='w',x='x',y='y',z='z';

let inpOffset = 0;

function assignToReg(reg: string, value: string): void {
    switch (reg) {
        case 'w': w = value; return;
        case 'x': x = value; return;
        case 'y': y = value; return;
        case 'z': z = value; return;
    }
    throw 'invalid reg in assignToReg: ' + reg;
}

function getReg(reg: string): string {
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

function getRegOrValue(operand: string|number): string {
    if (typeof operand === 'number') {
        return operand.toString();
    }
    return getReg(operand);
}

for (const op of ops) {
    switch (op[0]) {
        case 'inp': {
            let value: string;
            // if (inpOffset === 0) {
            //     value = '9';
            // } else {
                value = 'inp(' + inpOffset + ')';
            // }
            inpOffset++;
            assignToReg(op[1], value);
            break;
        }
        case 'add': {
            let value = getReg(op[1]);
            let operand = getRegOrValue(op[2]);
            if (!isNaN(Number(value)) && !isNaN(Number(operand))) {
                value = (Number(value) + Number(operand)).toString();
            } else if (operand === '0') {
                // value = value
            } else if (value === '0') {
                value = operand;
            } else {
                value = '(' + value + ') + (' + operand + ')';
            }
            assignToReg(op[1], value);
            break;
        }
        case 'mul': {
            let value = getReg(op[1]);
            let operand = getRegOrValue(op[2]);
            if (!isNaN(Number(value)) && !isNaN(Number(operand))) {
                value = (Number(value) * Number(operand)).toString();
            } else if (!isNaN(Number(operand)) && Number(operand) === 1) {
                //value = value;
            } else if (operand === '0' || value === '0') {
                value = '0';
            } else {
                value = '(' + value + ') * (' + operand + ')';
            }
            assignToReg(op[1], value);
            break;
        }
        case 'div': {
            let value = getReg(op[1]);
            let operand = getRegOrValue(op[2]);
            if (operand === '0') {
                throw 'div by zero';
            }
            if (!isNaN(Number(value)) && !isNaN(Number(operand))) {
                value = Math.trunc(Number(value) / Number(operand)).toString();
            } else if (operand === '0' || value === '0') {
                value = '0';
            } else if (operand === '1') {
                // value = value
            } else {
                value = '(' + value + ') / (' + operand + ')';
            }
            assignToReg(op[1], value);
            break;
        }
        case 'mod': {
            let value = getReg(op[1]);
            let operand = getRegOrValue(op[2]);
            if (operand === '0') {
                throw 'mod by zero';
            }
            if (!isNaN(Number(value)) && !isNaN(Number(operand))) {
                value = (Number(value) % Number(operand)).toString();
            } else if (value === '0') {
                // value = value
            } else {
                value = '(' + value + ') % (' + operand + ')';
            }
            assignToReg(op[1], value);
            break;
        }
        case 'eql': {
            let value = getReg(op[1]);
            let operand = getRegOrValue(op[2]);
            if (value === operand) {
                value = '1';
            } else if (!isNaN(Number(value)) && !isNaN(Number(operand))) {
                value = (Number(value) === Number(operand)) ? '1' : '0';
            } else if (!isNaN(Number(value)) && isInputOnly(operand) && ((Number(value) < 1) || (Number(value) > 9))) {
                value = '0';
            } else {
                value = '(' + value + ') == (' + operand + ')';
            }
            assignToReg(op[1], value);
            break;
        }
    }
}

console.log('w: ' + w);
console.log('x: ' + x);
console.log('y: ' + y);
console.log('z: ' + z);
