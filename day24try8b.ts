// node --max_old_space_size=8192 --require ts-node/register day24try8b.ts

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

type Register = 'w'|'x'|'y'|'z';
type RawOp = [string, Register, number|string|undefined];
const instructions = input.split('\n').map(r => r.split(' ').map(i => !isNaN(Number(i)) ? Number(i) : i) as RawOp);

type CalcValue = Set<number>;

function fixedValue(num: number): CalcValue {
    return new Set([num]);
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

interface OpNode {
    op: string;
    pre1: string;
    pre2?: string|number;
    values: CalcValue;
}

const symbols = new Map<string, OpNode>();

const names = {
    w: 'wb',
    x: 'xb',
    y: 'yb',
    z: 'zb',
};

symbols.set(names['w'], { op: 'base', pre1: '', values: new Set([0] )});
symbols.set(names['x'], { op: 'base', pre1: '', values: new Set([0] )});
symbols.set(names['y'], { op: 'base', pre1: '', values: new Set([0] )});
symbols.set(names['z'], { op: 'base', pre1: '', values: new Set([0] )});

const InpValids = [
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

let inpOffset = 0;

function getCurrentRegSymbolValues(reg: Register): [string, CalcValue] {
    const lastSymbol = names[reg];
    const lastValues = symbols.get(lastSymbol);
    if (!lastValues) {
        throw 'Missing lastvalues: ' + reg + ' - ' + lastSymbol;
    }
    return [lastSymbol, lastValues.values];
}

for (let i=0; i<instructions.length; i++) {
    const opcode = instructions[i][0];
    const reg = instructions[i][1];
    const operand = instructions[i][2];
    console.log(i + ': ' + opcode + ':', instructions[i]);
    
    let op: OpNode;
    if (opcode === 'inp') {
        const inpNum = inpOffset++;
        const expr = 'inp(' + inpNum + ')';

        op = {
            op: opcode,
            pre1: expr,
            values: new Set(InpValids[inpNum]),
            // values: new Set([1,2,3,4,5,6,7,8,9]),
        };
    } else {
        const [regSymbol, regValues] = getCurrentRegSymbolValues(reg);

        let operandValues: CalcValue;
        let operandSymbol: string | number;
        if (typeof operand === 'number') {
            operandSymbol = operand;
            operandValues = fixedValue(operand);
        } else {
            [operandSymbol, operandValues] = getCurrentRegSymbolValues(operand as Register);
        }

        op = {
            op: opcode,
            pre1: regSymbol,
            pre2: operandSymbol,
            values: runOp(opcode, regValues, operandValues),
        };
    }

    const outName = reg + i;
    names[reg] = outName;
    symbols.set(outName, op);

    console.log(outName + ' = ' + op.values.size + ' values');
}

console.log([...symbols.entries()]);

// Start constraining
//let toConstrain: [string,CalcValue][] = [[names['w'],new Set([1])]];
let toConstrain: [string,CalcValue][] = [[names['z'],new Set([0])]];
while (toConstrain.length > 0) {
    const nextSymbols: [string,CalcValue][] = [];
    for (const item of toConstrain) {
        console.log('Limiting: ' + item[0] + ' to ' + item[1].size + ' entries');
        const symbol = symbols.get(item[0])!;
        symbol.values = item[1];

        if (symbol.op === 'inp') {
            console.warn('Inp ' + symbol.pre1 + ':', item[1]);
        } else {
            const regValues = symbols.get(symbol.pre1)!.values;

            let operandValues: CalcValue;
            if (typeof symbol.pre2 === 'number') {
                operandValues = fixedValue(symbol.pre2);
            } else {
                operandValues = symbols.get(symbol.pre2!)!.values;
            }

            const regValuesFiltered: CalcValue = new Set();
            const operandValuesFiltered: CalcValue = new Set();
            for (const regN of regValues) {
                for (const opN of operandValues) {
                    let outValue: number;
                    switch (symbol.op) {
                        case 'add': outValue = regN + opN; break;
                        case 'mul': outValue = regN * opN; break;
                        case 'div': outValue = Math.trunc(regN / opN); break;
                        case 'mod': outValue = regN % opN; break;
                        case 'eql': outValue = (regN === opN) ? 1 : 0; break;
                        default: throw 'bad op: ' + symbol.op;
                    }
                    if (symbol.values.has(outValue)) {
                        regValuesFiltered.add(regN);
                        operandValuesFiltered.add(opN);
                    }
                }
            }

            if (regValues.size !== regValuesFiltered.size) {
                nextSymbols.push([symbol.pre1, regValuesFiltered]);
            }
            if (operandValues.size !== operandValuesFiltered.size && typeof symbol.pre2 === 'string') {
                nextSymbols.push([symbol.pre2, operandValuesFiltered]);
            }
        }
    }
    toConstrain = nextSymbols;
}
