import * as fs from "fs";
import { join } from "path";

describe("day 1", () => {
  it("part 1", async () => {
    let cals = 0;
    let index = 0;
    const highestValue = {
      index: 0,
      cals: 0,
    };

    for await (const value of read(join(__dirname, "input.txt"))) {
      if (value) {
        cals += parseInt(value);
      } else {
        if (cals > highestValue.cals) {
          highestValue.index = index;
          highestValue.cals = cals;
        }
        index++;
        cals = 0;
      }
    }
    console.log(highestValue);
  });

  it("part 2", async () => {
    let cals = 0;
    let index = 0;
    let top3 = [
      { index: 0, cals: 0 },
      { index: 0, cals: 0 },
      { index: 0, cals: 0 },
    ];

    for await (const value of read(join(__dirname, "input.txt"))) {
      if (value) {
        cals += parseInt(value);
      } else {
        const candidate = { index, cals };
        index++;
        cals = 0;

        if (candidate.cals > top3[2].cals) {
          top3.push(candidate);
          top3 = top3.slice(-3);
        } else if (candidate.cals > top3[1].cals) {
          top3.splice(1, 1, candidate);
        } else if (candidate.cals > top3[0].cals) {
          top3.splice(0, 1, candidate);
        }
      }
    }
    console.log(top3[0], top3[1], top3[2]);
    console.log(top3[0].cals + top3[1].cals + top3[2].cals);
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
