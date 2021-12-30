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

const ops = inputSub.split('\n').map(r => r.split(' ').map(i => !isNaN(Number(i)) ? Number(i) : i) as [string, string, number|string]);

interface Register {
    min: number;
    max: number;
}

let w = { min: 0, max: 0 };
let x = { min: 0, max: 0 };
let y = { min: 0, max: 0 };
let z = { min: 0, max: 0 };

let inpOffset = 0;

function assignToReg(reg: string, value: Register): void {
    switch (reg) {
        case 'w': w = value; return;
        case 'x': x = value; return;
        case 'y': y = value; return;
        case 'z': z = value; return;
    }
    throw 'invalid reg in assignToReg: ' + reg;
}

function getReg(reg: string): Register {
    switch (reg) {
        case 'w': return w;
        case 'x': return x;
        case 'y': return y;
        case 'z': return z;
    }
    throw 'invalid reg in getReg: ' + reg;
}

function getRegOrValue(operand: string|number): Register {
    if (typeof operand === 'number') {
        return { min: operand, max: operand }
    }
    return getReg(operand);
}

for (const op of ops) {
    switch (op[0]) {
        case 'inp':
            assignToReg(op[1], { min: 1, max: 9 });
            break;
        case 'add': {
            let value = getReg(op[1]);
            let operand = getRegOrValue(op[2]);
            value = { min: value.min + operand.min, max: value.max + operand.max };
            assignToReg(op[1], value);
            break;
        }
        case 'mul': {
            let value = getReg(op[1]);
            let operand = getRegOrValue(op[2]);
            if (operand === '0' || value === '0') {
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
            if (operand === '0' || value === '0') {
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
            if (value === '0') {
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
                throw 'wowequal';
            }
            value = '(' + value + ') == (' + operand + ')';
            assignToReg(op[1], value);
            break;
        }
    }
}

//console.log('w: ' + w);
// console.log('x: ' + x);
console.log('y: ' + y);
// console.log('z: ' + z);
