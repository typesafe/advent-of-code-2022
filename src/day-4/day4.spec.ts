import * as fs from "fs";
import { join } from "path";
import { InputFile } from "../input";

describe("day 4", () => {
  it("part 1", async () => {
    let count = 0;
    for await (const ranges of readRanges(join(__dirname, "input.txt"))) {
      const overlap = includes(ranges);
      if (overlap) {
        count++;
      }
    }
    console.log(count);
  });

  it("part 2", async () => {
    let count = 0;
    for await (const ranges of readRanges(join(__dirname, "input.txt"))) {
      const overlap = getOverlap(ranges);
      if (overlap) {
        count++;
      }
    }
    console.log(count);
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

function includes(values: number[][]) {
  if (values[1][0] >= values[0][0] && values[1][1] <= values[0][1]) {
    return true;
  }
  if (values[0][0] >= values[1][0] && values[0][1] <= values[1][1]) {
    return true;
  }
  return false;
}

function getOverlap(values: number[][]) {
  if (values[1][0] <= values[0][1] && values[1][1] >= values[0][0]) {
    return true;
  }
  if (values[0][0] <= values[1][1] && values[0][1] >= values[1][0]) {
    return true;
  }
  return false;
}

function valueOf(char: string) {
  const charCode = char.charCodeAt(0);
  return charCode >= 97 ? charCode - 96 : charCode - 38;
}
async function* readRanges(path: string) {
  for await (const line of InputFile.readLines(path)) {
    if (line) {
      const ranges = line
        .split(",")
        .map((r) => r.split("-").map((v) => parseInt(v)));
      yield ranges;
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
