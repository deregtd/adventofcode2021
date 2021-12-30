const input = `C20D42002ED333E7774EAAC3C2009670015692C61B65892239803536C53E2D307A600ACF324928380133D18361005B336D3600B4BF96E4A59FED94C029981C96409C4A964F995D2015DE6BD1C6E7256B004C0010A86B06A1F0002151AE0CC79866600ACC5CABC0151006238C46858200E4178F90F663FBA4FDEC0610096F8019B8803F19A1641C100722E4368C3351D0E9802D60084DC752739B8EA4ED377DE454C0119BBAFE80213F68CDC66A349B0B0053B23DDD61FF22CB874AD1C4C0139CA29580230A216C9FF54AD25A193002A2FA002AB3A63377C124205008A05CB4B66B24F33E06E014CF9CCDC3A2F22B72548E842721A573005E6E5F76D0042676BB33B5F8C46008F8023301B3F59E1464FB88DCBE6680F34C8C0115CDAA48F5EE45E278380019F9EC6395F6BE404016849E39DE2EF002013C873C8A401544EB2E002FF3D51B9CAF03C0010793E0344D00104E7611C284F5B2A10626776F785E6BD672200D3A801A798964E6671A3E9AF42A38400EF4C88CC32C24933B1006E7AC2F3E8728C8E008C759B45400B4A0B4A6CD23C4AF09646786B70028C00C002E6D00AEC1003440080024658086A401EE98070B50029400C0014FD00489000F7D400E000A60001E870038800AB9AB871005B12B37DB004266FC28988E52080462973DD0050401A8351DA0B00021D1B220C1E0013A0C0198410BE1C180370C21CC552004222FC1983A0018FCE2ACBDF109F76393751D965E3004E763DB4E169E436C0151007A10C20884000874698630708050C00043E24C188CC0008744A8311E4401D8B109A3290060BE00ACEA449214CD7B084B04F1A48025F8BD800AB4D64426B22CA00FC9BE4EA2C9EA6DC40181E802B39E009CB5B87539DD864A537DA7858C011B005E633E9F6EA133FA78EE53B7DE80`;

const inputLiteral = `D2FE28`;
const inputOperator = `38006F45291200`;

interface Packet {
    version: number;
    typeId: number;

    length: number;
}

interface PacketLiteral extends Packet {
    value: number;
}

interface PacketOperator extends Packet {
    packets: Packet[];
}

enum TypeIds {
    OperationSum = 0,
    OperationProduct = 1,
    OperationMin = 2,
    OperationMax = 3,
    OperationGT = 5,
    OperationLT = 6,
    OperationEQ = 7,

    Literal = 4,
}

class BitReader {
    private static _CharZero = '0'.charCodeAt(0);

    private _bitOffset = 0;
    private _charOffset = 0;
    constructor(private _input: string) {
    }

    public readBits(numBits: number): number {
        let num = 0;
        for (let i=0; i<numBits; i++) {
            num <<= 1;
            num |= this._readBit();
        }
        // console.log('bits: ' + numBits + ', : ' + num);
        return num;
    }

    public align(): void {
        while (this._bitOffset !== 0) {
            const testBit = this._readBit();
            // if (testBit === 1) {
            //     throw 'bad bit';
            // }
        }
    }

    private _readBit(): 0|1 {
        if (this.eof()) {
            throw 'eof';
        }

        let char = this._input.charCodeAt(this._charOffset) - BitReader._CharZero;
        if (char > 9) {
            char -= 7;
        }
        const bit = char & (8 >> this._bitOffset);
        // console.log('readbit: ' + char + ', bit ' + bit);
        this._bitOffset++;
        if (this._bitOffset >= 4) {
            this._charOffset++;
            this._bitOffset = 0;
        }
        return (bit > 0) ? 1 : 0;
    }

    public getOffset(): number {
        return (this._charOffset << 2) | this._bitOffset;
    }

    public getLength(): number {
        return this._input.length << 2;
    }

    public eof(): boolean {
        return (this._charOffset >= this._input.length);
    }

    public decodePacket(): Packet {
        const start = this.getOffset();
        const version = this.readBits(3);
        const typeId = this.readBits(3);
        const off = this.getOffset();
        // console.log(start, off);
        // console.log(version, typeId);
        if (typeId === TypeIds.Literal) {
            let value = 0;
            while (true) {
                value *= 16;
                const part = this.readBits(5);
                value += part & 0xF;
                if ((part & 0x10) === 0) {
                    // this.align();
                    const packet: PacketLiteral = {
                        version,
                        typeId,
                        length: this.getOffset() - start,
                        value,
                    };
                    console.log('literal: ', packet);
                    return packet;
                }
            }
        } else {
            // Operator
            const lengthTypeId = this.readBits(1);
            let bitLengthTotal = -1;
            let subPacketCount = -1;
            if (lengthTypeId === 0) {
                bitLengthTotal = this.readBits(15);
            } else {
                subPacketCount = this.readBits(11);
            }
            // console.log('operator: ' + bitLengthTotal + ', ' + subPacketCount);
            let packets: Packet[] = [];
            const subByteStart = this.getOffset();
            while (true) {
                const subPacket = reader.decodePacket();
                packets.push(subPacket);
                if ((subPacketCount !== -1 && packets.length === subPacketCount) || 
                        (bitLengthTotal !== -1 && (reader.getOffset() - subByteStart >= bitLengthTotal))) {
                    const packet: PacketOperator = {
                        version,
                        typeId,
                        length: this.getOffset() - start,
                        packets,
                    }
                    return packet;
                }
            }
        }

        throw 'not possible';
    }
}

function evaluatePacket(packet: Packet): number {
    if (packet.typeId === TypeIds.Literal) {
        return (packet as PacketLiteral).value;
    }
    const pValues = (packet as PacketOperator).packets.map(p => evaluatePacket(p));

    switch (packet.typeId as TypeIds) {
        case TypeIds.OperationSum: {
            return pValues.reduce((prev, cur) => prev + cur);
        }
        case TypeIds.OperationProduct: {
            let prod = pValues[0];
            for (let i=1; i<pValues.length; i++) {
                prod *= pValues[i];
            }
            return prod;
        }
        case TypeIds.OperationMin: {
            return Math.min(...pValues);
        }
        case TypeIds.OperationMax: {
            return Math.max(...pValues);
        }
        case TypeIds.OperationGT: {
            if (pValues.length !== 2) {
                throw 'gt';
            }
            return (pValues[0] > pValues[1]) ? 1 : 0;
        }
        case TypeIds.OperationLT: {
            if (pValues.length !== 2) {
                throw 'lt';
            }
            return (pValues[0] < pValues[1]) ? 1 : 0;
        }
        case TypeIds.OperationEQ: {
            if (pValues.length !== 2) {
                throw 'eq';
            }
            return (pValues[0] === pValues[1]) ? 1 : 0;
        }
    }     

    throw 'wtf';
}

const reader = new BitReader(input);

let packets: Packet[] = [];
let versionTotal = 0;
while (reader.getOffset() < reader.getLength() - 4) {
    const packet = reader.decodePacket();
    packets.push(packet);
}

console.log(packets);
console.log(evaluatePacket(packets[0]));