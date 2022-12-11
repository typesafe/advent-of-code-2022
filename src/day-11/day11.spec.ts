import * as fs from "fs";
import { join } from "path";
import { InputFile } from "../input";

describe("day 11", () => {
  it("part 1", async () => {
    const { items, monkeys } = await readInstructions();

    // 20 rounds
    for (let round = 0; round < 20; round++) {
      for (const monkey of monkeys) {
        for (const item of monkey.items) {
          monkey.inspections++;
          item.worryLevel = Math.floor(monkey.operation(item.worryLevel) / 3);
          const newMonkey =
            item.worryLevel % monkey.divisableBy == 0
              ? monkey.throwTo[1]
              : monkey.throwTo[0];
          item.monkey = newMonkey;
          monkeys[newMonkey].items.push(item);
        }
        monkey.items = [];
      }
    }

    const [first, second] = monkeys
      .map((m) => m.inspections)
      .sort((a, b) => b - a);

    console.log(first * second);
  });

  it("part 2", async () => {
    const { items, monkeys } = await readInstructions();

    const mod = monkeys.reduce((acc, m) => acc * m.divisableBy, 1);
    // 20 rounds
    for (let round = 0; round < 10_000; round++) {
      for (const monkey of monkeys) {
        for (const item of monkey.items) {
          monkey.inspections++;
          item.worryLevel = monkey.operation(item.worryLevel);
          const remainder = item.worryLevel % monkey.divisableBy;
          const newMonkey =
            remainder == 0 ? monkey.throwTo[1] : monkey.throwTo[0];

          item.worryLevel = item.worryLevel % mod;
          item.monkey = newMonkey;
          monkeys[newMonkey].items.push(item);
        }
        monkey.items = [];
      }
    }

    const [first, second] = monkeys
      .map((m) => m.inspections)
      .sort((a, b) => b - a);

    console.log(first * second);
  });
});

type Item = { worryLevel: number; monkey: number };

type Monkey = {
  inspections: number;
  items: Item[];
  operation: (level: number) => number;
  divisableBy: number;
  throwTo: [number, number];
};

async function readInstructions() {
  const items: Item[] = [];
  const monkeys: Monkey[] = [];
  let currentMonkey: Monkey = {} as Monkey;

  for await (const line of InputFile.readLines(join(__dirname, "input.txt"))) {
    if (line.startsWith("Monkey")) {
      currentMonkey = { throwTo: [], inspections: 0 } as unknown as Monkey;
      monkeys.push(currentMonkey);
    } else if (line.startsWith("  Starting")) {
      currentMonkey.items = line
        .substring(18)
        .split(", ")
        .map((w) => ({ worryLevel: parseInt(w), monkey: monkeys.length - 1 }));
      items.push(...currentMonkey.items);
    } else if (line.startsWith("  Operation")) {
      currentMonkey.operation = eval(`(old) => ${line.substring(19)}`);
    } else if (line.startsWith("  Test")) {
      currentMonkey.divisableBy = parseInt(line.substring(21));
    } else if (line.startsWith("    If true")) {
      currentMonkey.throwTo.unshift(parseInt(line.substring(29)));
    } else if (line.startsWith("    If false")) {
      currentMonkey.throwTo.unshift(parseInt(line.substring(30)));
    }
  }

  return { items, monkeys };
}
