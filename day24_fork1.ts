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

const ops = input.split('\n').map(r => r.split(' ').map(i => !isNaN(Number(i)) ? Number(i) : i) as [string, string, number|string]);

let w=0,x=0,y=0,z=0;

function assignToReg(reg: string, value: number): void {
    switch (reg) {
        case 'w': w = value; return;
        case 'x': x = value; return;
        case 'y': y = value; return;
        case 'z': z = value; return;
    }
    throw 'invalid reg in assignToReg: ' + reg;
}

function getReg(reg: string): number {
    switch (reg) {
        case 'w': return w;
        case 'x': return x;
        case 'y': return y;
        case 'z': return z;
    }
    throw 'invalid reg in getReg: ' + reg;
}

function getRegOrValue(operand: string|number): number {
    if (typeof operand === 'number') {
        return operand;
    }
    return getReg(operand);
}

let inps = Array(14).fill(9);
while (true) {
    const modelNum = Number(inps.join(''));

    if ((modelNum % 100000) === 11111) {
        console.log(modelNum);
    }

    w=0;
    x=0;
    y=0;
    z=0;

    let inpOffset = 0;

    for (const op of ops) {
        switch (op[0]) {
            case 'inp':
                assignToReg(op[1], inps[inpOffset++]);
                break;
            case 'add': {
                let value = getReg(op[1]);
                value += getRegOrValue(op[2]);
                assignToReg(op[1], value);
                break;
            }
            case 'mul': {
                let value = getReg(op[1]);
                value *= getRegOrValue(op[2]);
                assignToReg(op[1], value);
                break;
            }
            case 'div': {
                let value = getReg(op[1]);
                let operand = getRegOrValue(op[2]);
                if (operand === 0) {
                    throw 'div by zero';
                }
                value /= operand;
                value = Math.trunc(value);
                assignToReg(op[1], value);
                break;
            }
            case 'mod': {
                let value = getReg(op[1]);
                let operand = getRegOrValue(op[2]);
                if (operand === 0) {
                    throw 'mod by zero';
                }
                value %= operand;
                assignToReg(op[1], value);
                break;
            }
            case 'eql': {
                let value = getReg(op[1]);
                let operand = getRegOrValue(op[2]);
                assignToReg(op[1], value === operand ? 1 : 0);
                break;
            }
        }
    }

    if (z === 0) {
        console.log('worked! ' + modelNum);
        break;
    }

    for (let i=13; i>=0; i--) {
        inps[i]--;
        if (inps[i] > 0) {
            break;
        }
        inps[i] = 9;
    }
}
