import * as fs from "fs";
import { join } from "path";

describe("day 2", () => {
  it("part 1", async () => {
    const table = generateTable();
    const simulations = [
      {
        mapping: { X: "A", Y: "B", Z: "C" } as { [key: string]: shape },
        score: 0,
      },
      {
        mapping: { X: "A", Y: "C", Z: "B" } as { [key: string]: shape },
        score: 0,
      },
      {
        mapping: { X: "B", Y: "A", Z: "C" } as { [key: string]: shape },
        score: 0,
      },
      {
        mapping: { X: "B", Y: "C", Z: "A" } as { [key: string]: shape },
        score: 0,
      },
      {
        mapping: { X: "C", Y: "B", Z: "A" } as { [key: string]: shape },
        score: 0,
      },
      {
        mapping: { X: "C", Y: "A", Z: "B" } as { [key: string]: shape },
        score: 0,
      },
    ];

    for await (const round of read(join(__dirname, "input.txt"))) {
      if (!round) {
        continue;
      }
      const values = round.split(" ");
      const opponent = values[0];
      for (const sim of simulations) {
        const me = sim.mapping[values[1]];
        sim.score += table[opponent + me];
      }
    }
    console.log(simulations);
  });

  const scoreBySymbol = {
    A: 1, // rock
    B: 2, // paper
    C: 3, // scissors
  } as const;

  const scoreByOutcome = {
    W: 6, // win
    D: 3, // draw
    L: 0, // loss
  } as const;

  const hierarchy = {
    // me : opp
    A: { A: "D", B: "L", C: "W" },
    B: { A: "W", B: "D", C: "L" },
    C: { A: "L", B: "W", C: "D" },
  } as const;

  const wdlMap = {
    // WDL : opp : me
    X: { A: "C", B: "A", C: "B" },
    Y: { A: "A", B: "B", C: "C" },
    Z: { A: "B", B: "C", C: "A" },
  } as const;

  type shape = "A" | "B" | "C";

  function getScore(opp: shape, me: shape) {
    return scoreByOutcome[hierarchy[me][opp]] + scoreBySymbol[me];
  }

  function generateTable() {
    const table: { [key: string]: number } = {};
    for (const x of ["A", "B", "C"] as const) {
      for (const y of ["A", "B", "C"] as const) {
        table[x + y] = getScore(x, y);
      }
    }
    return table;
  }

  function generateWDLTable() {
    const table: { [key: string]: number } = {};
    for (const x of ["A", "B", "C"] as const) {
      for (const y of ["X", "Y", "Z"] as const) {
        table[x + y] = getScore(x, wdlMap[y][x]);
      }
    }
    return table;
  }

  it("part 2", async () => {
    const table = generateWDLTable();
    let score = 0;
    for await (const round of read(join(__dirname, "input.txt"))) {
      if (!round) {
        continue;
      }
      score += table[round.replace(" ", "")];
    }
    console.log(score);
  });
});

async function* read(path: string) {
  const s = fs.createReadStream(path, {
    encoding: "utf-8",
  });
  let buffer = "";

  for await (const chunk of s) {
    buffer += chunk;
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      yield line;
    }
  }
  if (buffer) {
    yield buffer;
  }
}
