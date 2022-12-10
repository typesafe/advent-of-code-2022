import * as fs from "fs";
import { join } from "path";
import { InputFile } from "../input";

describe("day 3", () => {
  it("part 1", async () => {
    let prioritySum = 0;
    for await (const [one, two] of readCompartments(
      join(__dirname, "input.txt")
    )) {
      const overlap = getOverlap(one, two);
      if (!overlap.length) {
        continue;
      }

      prioritySum += overlap.reduce((s, v) => s + valueOf(v), 0);
    }
    console.log(prioritySum);
  });

  it("part 2", async () => {
    let prioritySum = 0;
    for await (const group of readElfGroups(join(__dirname, "input.txt"))) {
      const overlap = getOverlap(...group);
      //console.log(overlap);

      if (!overlap.length) {
        continue;
      }
      prioritySum += overlap.reduce((s, v) => s + valueOf(v), 0);
    }
    console.log(prioritySum);
  });
});

class ItemList {
  index = 0;
  private items: string[];
  constructor(items: string) {
    this.items = items.split("").sort();
  }

  get current() {
    return this.items[this.index];
  }
  proceed() {
    this.index++;
  }
  proceedTo(char: string) {
    while (this.current && this.current < char) {
      this.index++;
    }
  }
}

// abcdg
// afghkl

function getOverlap(...values: string[]) {
  const lists = values.map((items) => new ItemList(items));

  const result = new Set();
  let currentValues = lists.map((l) => l.current);
  while (currentValues.every((v) => !!v)) {
    if (!currentValues.some((v) => v != currentValues[0])) {
      result.add(currentValues[0]);
      lists.forEach((l) => l.proceed());
    } else {
      const highestValue = currentValues.reduce(
        (r, v, i) => {
          return v > r.v ? { ix: i, v } : r;
        },
        {
          ix: 0,
          v: "0",
        }
      );
      for (const [i, list] of lists.entries()) {
        if (i != highestValue.ix) {
          list.proceedTo(highestValue.v);
        }
      }
    }

    // else if (items1.current > items2.current) {
    //   items2.proceedTo(items1.current);
    // } else {
    //   items1.proceedTo(items2.current);
    // }

    currentValues = lists.map((l) => l.current);
  }
  return Array.from(result) as string[];
}

function valueOf(char: string) {
  const charCode = char.charCodeAt(0);
  return charCode >= 97 ? charCode - 96 : charCode - 38;
}
async function* readCompartments(path: string) {
  for await (const line of InputFile.readLines(path)) {
    if (line) {
      const middleIndex = line.length / 2;
      yield [line.slice(0, middleIndex), line.slice(middleIndex)];
    }
  }
}

async function* readElfGroups(path: string) {
  let group = [];
  for await (const line of InputFile.readLines(path)) {
    if (line) {
      group.push(line);

      if (group.length == 3) {
        yield group;
        group = [];
      }
    }
  }
}
