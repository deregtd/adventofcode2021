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

type Op = [string, string, number|string];
const ops = input.split('\n').map(r => r.split(' ').map(i => !isNaN(Number(i)) ? Number(i) : i) as Op);

interface CalcValue {
    nums: number[];
    expr: string;
}

function fixedValue(num: number): CalcValue {
    return { nums: [num], expr: num.toString() };
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

function getOperand(op: Op): CalcValue {
    if (op[0] === 'inp') {
        const expr = 'inp(' + inpOffset + ')'
        inpOffset++;
        return { nums: [1,2,3,4,5,6,7,8,9], expr: expr };
    }
    const operand = op[2];
    if (typeof operand === 'number') {
        return fixedValue(operand);
    }
    return getReg(operand);
}

// 19, 37, 55, 80
for (let opNum=0; opNum<ops.length; opNum++) {
// for (let opNum=0; opNum<55; opNum++) {
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
            if (!isNaN(Number(regCont.expr)) && !isNaN(Number(operand.expr))) {
                value = fixedValue(Number(regCont.expr) + Number(operand.expr));
            } else if (operand.expr === '0') {
                value = regCont;
            } else if (regCont.expr === '0') {
                value = operand;
            } else {
                let nums: number[] = [];
                for (const regN of regCont.nums) {
                    for (const opN of operand.nums) {
                        nums.push(regN + opN);
                    }
                }
                value = {
                    nums,
                    expr: '(' + regCont.expr + ') + (' + operand.expr + ')'
                }
            }
            break;
        }
        case 'mul': {
            if (!isNaN(Number(regCont.expr)) && !isNaN(Number(operand.expr))) {
                value = fixedValue(Number(regCont.expr) * Number(operand.expr));
            } else if (operand.expr === '1') {
                value = regCont;
            } else if (operand.expr === '0' || regCont.expr === '0') {
                value = fixedValue(0);
            } else {
                let nums: number[] = [];
                for (const regN of regCont.nums) {
                    for (const opN of operand.nums) {
                        nums.push(regN * opN);
                    }
                }
                value = {
                    nums,
                    expr: '(' + regCont.expr + ') * (' + operand.expr + ')'
                }
            }
            break;
        }
        case 'div': {
            if (!isNaN(Number(regCont.expr)) && !isNaN(Number(operand.expr))) {
                value = fixedValue(Math.trunc(Number(regCont.expr) / Number(operand.expr)));
            } else if (regCont.expr === '0') {
                value = regCont;
            } else if (operand.expr === '1') {
                value = regCont;
            } else {
                let nums: number[] = [];
                for (const regN of regCont.nums) {
                    for (const opN of operand.nums) {
                        nums.push(Math.trunc(regN / opN));
                    }
                }
                value = {
                    nums,
                    expr: '(' + regCont.expr + ') / (' + operand.expr + ')'
                }
            }
            break;
        }
        case 'mod': {
            if (!isNaN(Number(regCont.expr)) && !isNaN(Number(operand.expr))) {
                value = fixedValue(Number(regCont.expr) % Number(operand.expr));
            } else if (regCont.expr === '0') {
                value = regCont;
            } else if (operand.expr === '1') {
                value = regCont;
            } else {
                let nums: number[] = [];
                for (const regN of regCont.nums) {
                    for (const opN of operand.nums) {
                        nums.push(regN % opN);
                    }
                }
                value = {
                    nums,
                    expr: '(' + regCont.expr + ') % (' + operand.expr + ')'
                }
            }
            break;
        }
        case 'eql': {
            if (!isNaN(Number(regCont.expr)) && !isNaN(Number(operand.expr))) {
                value = fixedValue((Number(regCont.expr) === Number(operand.expr)) ? 1 : 0);
            } else if (regCont.expr === operand.expr) {
                value = fixedValue(1);
            } else {
                let nums: number[] = [];
                for (const regN of regCont.nums) {
                    for (const opN of operand.nums) {
                        nums.push((regN === opN) ? 1 : 0);
                    }
                }
                value = {
                    nums,
                    expr: '(' + regCont.expr + ') == (' + operand.expr + ')'
                }
            }
            break;
        }
        default:
            throw 'bad op: ' + op;
    }

    value.nums = uniq(value.nums);
    if (value.nums.length === 1) {
        value = fixedValue(value.nums[0]);
    }

    console.log(opNum + ':', op, ':', regCont, operand, ' => ', value);
    assignToReg(reg, value);
}

// console.log('w: ', w);
// console.log('x: ', x);
// console.log('y: ', y);
z.nums.sort((a, b) => a - b);
console.log('z: ', z);

