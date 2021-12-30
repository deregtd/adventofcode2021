// #############
// #...........#
// ###B#C#B#D###
//   #A#D#C#A#
//   #########

// Hall (11 long), four rooms (top to bottom), and total energy
interface RoomState {
    hall: number[];
    rooms: [number, number][];
    energy: number;
}

const ValidHallMoves = [0, 1, 3, 5, 7, 9, 10];
const EmptyHall = [0,0,0,0,0,0,0,0,0,0,0];

const InitialState: RoomState = { hall: EmptyHall, rooms: [[3, 2], [2, 3], [1, 4], [4, 1]], energy: 0 };

// example parts
//const InitialState: RoomState = { hall: [0,0,0,0,0,0,0,0,0,1,0], rooms: [[0, 1], [2, 2], [3, 3], [4, 4]], energy: 0 };
//const InitialState: RoomState = { hall: [0,0,0,0,0,4,0,4,0,1,0], rooms: [[0, 1], [2, 2], [3, 3], [0, 0]], energy: 0 };
//const InitialState: RoomState = { hall: [0,0,0,0,0,4,0,0,0,0,0], rooms: [[0, 1], [2, 2], [3, 3], [4, 1]], energy: 0 };
//const InitialState: RoomState = { hall: [0,0,0,0,0,4,0,0,0,0,0], rooms: [[2, 1], [0, 2], [3, 3], [4, 1]], energy: 0 };
//const InitialState: RoomState = { hall: [0,0,0,2,0,0,0,0,0,0,0], rooms: [[2, 1], [0, 4], [3, 3], [4, 1]], energy: 0 };
//const InitialState: RoomState = { hall: EmptyHall, rooms: [[2, 1], [3, 4], [2, 3], [4, 1]], energy: 0 };

function calcHash(state: RoomState): string {
    return state.hall.join('') + '_' + state.rooms.map(r => r.join('')).join('-');
}

function isFinished(state: RoomState): boolean {
    for (let i=0; i<4; i++) {
        if ((state.rooms[i][0] !== i+1) || (state.rooms[i][1] !== i+1)) {
            return false;
        }
    }
    return true;
}

function copyState(state: RoomState): RoomState {
    return {
        hall: [...state.hall],
        rooms: [
            [...state.rooms[0]],
            [...state.rooms[1]],
            [...state.rooms[2]],
            [...state.rooms[3]],
        ],
        energy: state.energy,
    };
}

function stepEnergy(poidType: number, steps: number): number {
    if (steps !== Math.round(steps)) {
        throw 'x';
    }
    if (poidType !== Math.round(poidType)) {
        throw 'y';
    }

    const energy = Math.pow(10, poidType-1) * steps;
    if (energy !== Math.round(energy)) {
        throw poidType + '_' + steps;
    }
    return energy;
}

function hallwayClear(state: RoomState, spot1: number, spot2: number): boolean {
    for (let i=Math.min(spot1, spot2); i<=Math.max(spot1, spot2); i++) {
        if (state.hall[i] !== 0) {
            return false;
        }
    }
    return true;
}

let lowestEnergyAtStateHash: {[key: string]: number} = {};

let lowestEnergyCompletion = Number.MAX_VALUE;

let toCheck: RoomState[] = [InitialState];
while (toCheck.length > 0) {
    console.log('Tocheck: ' + toCheck.length);
    let nextChecks: RoomState[] = [];
    for (const state of toCheck) {
        if (isFinished(state)) {
            lowestEnergyCompletion = Math.min(lowestEnergyCompletion, state.energy);
            console.log('Finished: ' + state.energy + ', Min: ' + lowestEnergyCompletion);
            continue;
        }

        if (state.energy >= lowestEnergyCompletion) {
            // early break
            continue;
        }

        const hash = calcHash(state);
        if (hash in lowestEnergyAtStateHash) {
            if (lowestEnergyAtStateHash[hash] <= state.energy) {
                continue;
            }
        }
        lowestEnergyAtStateHash[hash] = state.energy;

        // Check for anthropoids in the hall to try to move -- can only move into an empty hallway that is the correct one
        for (let i=0; i<EmptyHall.length; i++) {
            const poidType = state.hall[i];
            if (poidType !== 0) {
                if ((state.rooms[poidType-1][0] === 0) && (state.rooms[poidType-1][1] === 0 || state.rooms[poidType-1][1] === poidType)) {
                    // room is ready to receive
                    const newState = copyState(state);
                    // remove poid from hallway to calc for emptiness
                    newState.hall[i] = 0;
                    if (hallwayClear(newState, i, poidType*2)) {
                        const hallSteps = Math.abs(poidType*2 - i);
                        if (state.rooms[poidType-1][1] === 0) {
                            // Move to bottom of the hallway
                            newState.energy += stepEnergy(poidType, hallSteps + 2);
                            newState.rooms[poidType-1][1] = poidType;
                        } else if (state.rooms[poidType-1][0] === 0) {
                            // top of hallway
                            newState.energy += stepEnergy(poidType, hallSteps + 1);
                            newState.rooms[poidType-1][0] = poidType;
                        }
                        nextChecks.push(newState);
                        // console.log('Moving from spot ' + i + ' into room ' + (poidType - 1));
                    }
                }
            }
        }

        // Check hallways
        for (let i=0; i<=3; i++) {
            if (state.rooms[i][0] !== 0) {
                if ((state.rooms[i][0] !== (i+1)) || (state.rooms[i][1] !== (i+1))) {
                    // top occupied with something that needs to move
                    const poidType = state.rooms[i][0];
                    for (const spot of ValidHallMoves) {
                        if (hallwayClear(state, spot, 2 + 2*i)) {
                            // Can move to this spot
                            const newState = copyState(state);
                            // move poid
                            newState.hall[spot] = poidType;
                            newState.rooms[i][0] = 0;
                            const hallSteps = Math.abs((2 + 2*i) - spot);
                            // add hall steps + 1 for leaving the room top
                            newState.energy += stepEnergy(poidType, hallSteps + 1);
                            nextChecks.push(newState);
                        }
                    }
                }
            } else {
                // top empty, see if bottom has something to move
                if ((state.rooms[i][1] !== 0) && (state.rooms[i][1] !== (i+1))) {
                    // bottom occupied with something that needs to move
                    const poidType = state.rooms[i][1];
                    for (const spot of ValidHallMoves) {
                        if (hallwayClear(state, spot, 2 + 2*i)) {
                            // Can move to this spot
                            const newState = copyState(state);
                            // move poid
                            newState.hall[spot] = poidType;
                            newState.rooms[i][1] = 0;
                            const hallSteps = Math.abs((2 + 2*i) - spot);
                            // add hall steps + 2 for leaving the room bottom
                            newState.energy += stepEnergy(poidType, hallSteps + 2);
                            nextChecks.push(newState);
                        }
                    }
                }
            }
        }
    }
    toCheck = nextChecks;
}

console.log('Lowest: ' + lowestEnergyCompletion);
