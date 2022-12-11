import * as fs from "fs";
import { join } from "path";
import { InputFile } from "../input";

describe("day 9", () => {
  it("part 1", async () => {
    const visitedPositions = new Set<string>(["0,0"]); // visited flags
    const h: [number, number] = [0, 0];
    const t: [number, number] = [0, 0];

    for await (const instruction of readInstructions()) {
      for (let i = 0; i < instruction.count; i++) {
        Instructions[instruction.direction](h);
        const diff: [number, number] = [h[0] - t[0], h[1] - t[1]];
        if (diff[0] == 2) {
          t[0]++;
          t[1] += diff[1];
          visitedPositions.add(t.join());
        }
        if (diff[0] == -2) {
          t[0]--;
          t[1] += diff[1];
          visitedPositions.add(t.join());
        }
        if (diff[1] == 2) {
          t[1]++;
          t[0] += diff[0];
          visitedPositions.add(t.join());
        }
        if (diff[1] == -2) {
          t[1]--;
          t[0] += diff[0];
          visitedPositions.add(t.join());
        }
      }
    }

    console.log(visitedPositions.size);
  });

  it("part 2", async () => {
    const visitedPositions = new Set<string>(["0,0"]); // visited flags
    const h: [number, number] = [0, 0];
    const tail: [
      [number, number],
      [number, number],
      [number, number],
      [number, number],
      [number, number],
      [number, number],
      [number, number],
      [number, number],
      [number, number]
    ] = [
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0],
    ];

    for await (const instruction of readInstructions()) {
      for (let i = 0; i < instruction.count; i++) {
        Instructions[instruction.direction](h);
        for (let ti = 0; ti < 9; ti++) {
          const p = ti == 0 ? h : tail[ti - 1];
          const t = tail[ti];
          const diff: [number, number] = [p[0] - t[0], p[1] - t[1]];
          if (diff[0] == 2 && diff[1] == 2) {
            t[0]++;
            t[1]++;
            if (ti == 8) {
              visitedPositions.add(t.join());
            }
          } else if (diff[0] == -2 && diff[1] == 2) {
            t[0]--;
            t[1]++;
            if (ti == 8) {
              visitedPositions.add(t.join());
            }
          } else if (diff[0] == -2 && diff[1] == -2) {
            t[0]--;
            t[1]--;
            if (ti == 8) {
              visitedPositions.add(t.join());
            }
          } else if (diff[0] == 2 && diff[1] == -2) {
            t[0]++;
            t[1]--;
            if (ti == 8) {
              visitedPositions.add(t.join());
            }
          } else if (diff[0] == 2) {
            t[0]++;
            t[1] += diff[1];
            if (ti == 8) {
              visitedPositions.add(t.join());
            }
          } else if (diff[0] == -2) {
            t[0]--;
            t[1] += diff[1];
            if (ti == 8) {
              visitedPositions.add(t.join());
            }
          } else if (diff[1] == 2) {
            t[1]++;
            t[0] += diff[0];
            if (ti == 8) {
              visitedPositions.add(t.join());
            }
          } else if (diff[1] == -2) {
            t[1]--;
            t[0] += diff[0];
            if (ti == 8) {
              visitedPositions.add(t.join());
            }
          } else {
            break;
          }
        }
      }
    }

    console.log(visitedPositions.size);
  });
});

const Instructions = {
  D(v: [number, number]) {
    v[1]--;
  },
  U(v: [number, number]) {
    v[1]++;
  },
  L(v: [number, number]) {
    v[0]--;
  },
  R(v: [number, number]) {
    v[0]++;
  },
};

async function* readInstructions() {
  for await (const line of InputFile.readLines(join(__dirname, "input.txt"))) {
    const v = line.split(" ");
    yield {
      direction: v[0] as "U" | "R" | "D" | "L",
      count: parseInt(v[1]),
    };
  }
}
