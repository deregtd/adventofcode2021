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

interface SymbolInfo {
    op: string;
    reg: string;
    operand?: string|number;
    values: CalcValue;
    users: string[];
}

const symbols = new Map<string, SymbolInfo>();

const names = {
    w: 'wb',
    x: 'xb',
    y: 'yb',
    z: 'zb',
};

symbols.set(names['w'], { op: 'base', reg: '', values: new Set([0]), users: [] });
symbols.set(names['x'], { op: 'base', reg: '', values: new Set([0]), users: [] });
symbols.set(names['y'], { op: 'base', reg: '', values: new Set([0]), users: [] });
symbols.set(names['z'], { op: 'base', reg: '', values: new Set([0]), users: [] });

const InpValids = [
    [1],
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    // [1, 2, 3, 4, 5],
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
    // console.log(i + ': ' + opcode + ':', instructions[i]);
    
    let op: SymbolInfo;
    if (opcode === 'inp') {
        const inpNum = inpOffset++;
        const expr = 'inp' + inpNum;

        op = {
            op: opcode,
            reg: expr,
            values: new Set(InpValids[inpNum]),
            // values: new Set([1,2,3,4,5,6,7,8,9]),
            users: [],
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
            reg: regSymbol,
            operand: operandSymbol,
            values: runOp(opcode, regValues, operandValues),
            users: [],
        };
    }

    const outName = reg + i;
    names[reg] = outName;
    symbols.set(outName, op);

    // console.log(outName + ' = ' + op.values.size + ' values');
}

const inpLookups = new Array<string>(14);
for (const [name, symbol] of symbols.entries()) {
    if (symbol.op === 'inp') {
        inpLookups[Number(symbol.reg.substring(3))] = name;
    } else {
        const deps = [symbol.reg];
        if (typeof symbol.operand === 'string') {
            deps.push(symbol.operand);
        }
        for (const dep of deps) {

        }
    }
}

// bottom to top calc users
for (const [name, symbol] of [...symbols.entries()].reverse()) {
    if (symbol.op !== 'inp' && symbol.op !== 'base') {
        const deps = [symbol.reg];
        if (typeof symbol.operand === 'string') {
            deps.push(symbol.operand);
        }
        for (const dep of deps) {
            const depSymbol = symbols.get(dep);
            if (!depSymbol) {
                throw 'nosym1: ' + dep;
            }
            if (depSymbol.users.indexOf(name) === -1) {
                depSymbol.users.push(name);
            }
        }
    }
}

for (const [sName, symbol] of symbols) {
    console.log(sName + ': ' + symbol.op + ' ' + symbol.reg + ' ' + symbol.operand + ', vals: ' + symbol.values.size + ', users: ' + symbol.users.join(','));
}
//console.dir([...symbols.entries()], { depth: 2, maxArrayLength: null, breakLength: 140 });

interface Universe {
    symbolsTodo: string[];
    symbolVals: Map<string, number>;
}

// console.log('Inplookups:', inpLookups);

const codeSet = new Set<number>();

function checkUniverse(universe: Universe, symsTodo: string[]): void {
    if (symsTodo.length === 0) {
        // all done!
        const numbers = Number(inpLookups.map(inpSymName => universe.symbolVals.get(inpSymName)!).join(''));
        if (!codeSet.has(numbers)) {
            console.log('Finished universe -- Code: ' + numbers);
            codeSet.add(numbers);

            console.dir(universe, { depth: null });
            throw 'x';
        }
    }
}

// Start constraining
const baseUniverse: Universe = {
    symbolsTodo: [names['z']],
    symbolVals: new Map([[names['z'], 0]]),
};

for (const [name, symbol] of symbols.entries()) {
    if (symbol.values.size === 1) {
        baseUniverse.symbolVals.set(name, [...symbol.values.values()][0]!);
    }
}

console.log('baseuniverse:', baseUniverse);

let universes: Universe[] = [baseUniverse];
while (universes.length > 0) {
    const universe = universes.pop()!;
    console.log('Universe count: ' + universes.length + ', univ: ' + universe.symbolVals.size + ' symbols, todo: ' + universe.symbolsTodo);

    const symbolsTodo = universe.symbolsTodo.filter(symbolName => {
        const symbol = symbols.get(symbolName)!;

        if (symbol.op === 'inp' || symbol.op === 'base') {
            return false;
        }

        // if (universe.symbolVals.has(symbol.reg) && ((typeof symbol.operand === 'number') || (universe.symbolVals.has(symbol.operand!)))) {
        //     return false;
        // }

        return true;
    });
    // check if it's done
    checkUniverse(universe, symbolsTodo);
    let addedUniverse = false;
    let validSymbol = false;
    for (const symbolName of symbolsTodo) {
        // console.log('Symbol: ' + symbolName);
        const symbol = symbols.get(symbolName)!;
        if (symbol.users.find(user => !universe.symbolVals.has(user))) {
            // users haven't been all figured out yet!
            console.log('missing user: ' + symbolName);
            continue;
        }

        validSymbol = true;

        const nextTodo = symbolsTodo.filter(s => s !== symbolName);
        nextTodo.push(symbol.reg);

        // if (!symbols.has(symbol.pre1)) {
        //     console.log('Missing symbol: ',symbol);
        // }
        const regValues = universe.symbolVals.has(symbol.reg) ? new Set([universe.symbolVals.get(symbol.reg)!]) : symbols.get(symbol.reg)!.values;

        let operandValues: CalcValue;
        if (typeof symbol.operand === 'number') {
            operandValues = fixedValue(symbol.operand);
        } else {
            operandValues = universe.symbolVals.has(symbol.operand!) ? new Set([universe.symbolVals.get(symbol.operand!)!]) : symbols.get(symbol.operand!)!.values;

            nextTodo.push(symbol.operand!);
        }
        // if (symbol.pre1 === 'y248') {
        //     console.log(regValues);
        // }

        const constrainTo = universe.symbolVals.get(symbolName)!;

        let foundAny = false;
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
                if (outValue === constrainTo) {
                    // if (symbolName === 'y248') {
                    //     console.log(regN, opN, outValue, universe.symbolVals.get(symbol.pre2 as string), symbols.get(symbol.pre2 as string));
                    // }

                    const pre1Check = universe.symbolVals.get(symbol.reg);
                    if (pre1Check !== undefined && pre1Check !== regN) {
                        console.log('mismatch');
                        continue;
                    }

                    const newSymbolVals = new Map(universe.symbolVals.entries());
                    newSymbolVals.set(symbol.reg, regN);

                    if (typeof symbol.operand === 'string') {
                        newSymbolVals.set(symbol.operand!, opN);

                        const pre2Check = universe.symbolVals.get(symbol.operand!);
                        if (pre2Check !== undefined && pre2Check !== opN) {
                            console.log('mismatch2');
                            continue;
                        }
                    }

                    universes.push({symbolsTodo: nextTodo, symbolVals: newSymbolVals });
                    addedUniverse = true;
                    // foundAny = true;
                    // break;
                }
            }
            // if (foundAny) {
            //     break;
            // }
        }

        if (addedUniverse) {
            break;
        }
    }
    if (!validSymbol) {
        throw 'no symbol';
    }
    // if (!addedUniverse) {
    //     throw 'none found';
    // }
}

let maxCode = -1;
for (const code of codeSet.values()) {
    maxCode = Math.max(maxCode, code);
}
console.log('Finished!  Codes: ' + codeSet.size + ', Max: ' + maxCode);
