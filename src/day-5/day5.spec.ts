import * as fs from "fs";
import { join } from "path";
import { InputFile } from "../input";

describe("day 5", () => {
  it("part 1", async () => {
    let count = 0;

    const iterator = readInput(join(__dirname, "input.txt"));
    const stacks = (await iterator.next()).value as string[][];
    for await (let [count, from, to] of iterator as AsyncGenerator<number[]>) {
      for (let i = 0; i < count; i++) {
        stacks[to].push(stacks[from].pop()!);
      }
    }
    console.log(stacks.map((v) => v[v.length - 1]).join(""));
  });

  it("part 2", async () => {
    let count = 0;

    const iterator = readInput(join(__dirname, "input.txt"));
    const stacks = (await iterator.next()).value as string[][];
    for await (let [count, from, to] of iterator as AsyncGenerator<number[]>) {
      const items = stacks[from].splice(stacks[from].length - count, count);
      stacks[to].push(...items);
    }
    console.log(stacks.map((v) => v[v.length - 1]).join(""));
  });
});

async function* readInput(path: string) {
  let reachedMoves = false;
  const stacks: string[][] = [[], [], [], [], [], [], [], [], []];

  for await (const line of InputFile.readLines(path)) {
    if (!line) {
      reachedMoves = true;
      yield stacks;
      continue;
    }
    if (reachedMoves) {
      const moveInstructions = line.split(" ");
      yield [
        parseInt(moveInstructions[1]),
        parseInt(moveInstructions[3]) - 1,
        parseInt(moveInstructions[5]) - 1,
      ];
    } else {
      const width = 8 * 4 + 3;
      for (let i = 1; i < width; i += 4) {
        if (line[i] != " ") {
          stacks[(i - 1) / 4].unshift(line[i]);
        }
      }
    }
  }
}
