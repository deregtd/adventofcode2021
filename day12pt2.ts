const input = `cz-end
cz-WR
TD-end
TD-cz
start-UM
end-pz
kb-UM
mj-UM
cz-kb
WR-start
WR-pz
kb-WR
TD-kb
mj-kb
TD-pz
UM-pz
kb-start
pz-mj
WX-cz
sp-WR
mj-WR`;

const inputEx1 = `start-A
start-b
A-c
A-b
b-d
A-end
b-end`;

const inputEx2 = `dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc`;

interface Cave {
    name: string;
    big: boolean;
    links: string[];
}

const nodes: { [key: string]: Cave } = {};

for (const line of input.split('\n')) {
    const names = line.split('-');
    if (!(names[0] in nodes)) {
        nodes[names[0]] = { name: names[0], big: names[0] === names[0].toUpperCase(), links: [names[1]] };
    } else {
        nodes[names[0]].links.push(names[1]);
    }

    if (!(names[1] in nodes)) {
        nodes[names[1]] = { name: names[1], big: names[1] === names[1].toUpperCase(), links: [names[0]] };
    } else {
        nodes[names[1]].links.push(names[0]);
    }
}

const paths: string[][] = [];

function visitCave(cave: Cave, history: Cave[]): string[][] {
    if (cave.name === 'start' && history.length > 0) {
        return [];
    }
    if (cave.name === 'end') {
        return [history.map(c => c.name).concat(cave.name)];
    }

    const foundPaths = cave.links.map(linkName => {
        const newCave = nodes[linkName];

        if (!newCave.big) {
            if (history.find(c => c === newCave)) {
                // already visited a non-big cave -- have we already doubled up on another non-big cave?
                const set: {[name: string]: boolean} = {[cave.name]: true};
                for (const h of history) {
                    if (!h.big && h.name in set) {
                        // nope something else already doubled up
                        return [];
                    }
                    set[h.name] = true;
                }
            }
        }

        return visitCave(newCave, history.concat(cave));
    });

    return foundPaths.flat();
}

const allPaths = visitCave(nodes['start'], []);
console.log(allPaths.map(r => r.join(',')));
console.log(allPaths.length);
