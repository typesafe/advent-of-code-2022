import * as fs from "fs";
import { join } from "path";
import { InputFile } from "../input";

describe("day 10", () => {
  it("part 1", async () => {
    let cycle = 0;
    let signal = 0;
    let x = 1;
    let offset = 20;

    for await (const instruction of readInstructions()) {
      if (instruction.op == "noop") {
        cycle++;
      } else {
        cycle += 2;
      }

      if (cycle >= offset) {
        signal += offset * x;
        offset += 40;
      }

      if (instruction.arg) {
        x += instruction.arg;
      }
    }

    console.log(signal);
  });

  it("part 2", async () => {
    let cycle = -1;
    let signal = 0;
    let x = 1;
    const crt = [];

    for await (const instruction of readInstructions()) {
      const count = instruction.op == "noop" ? 1 : 2;
      for (let i = 0; i < count; i++) {
        cycle++;
        const rowOffset = cycle % 40;
        if (rowOffset == 0) {
          crt.push("");
        }
        crt[crt.length - 1] +=
        rowOffset == x || rowOffset - 1 == x || rowOffset + 1 == x ? "#" : " ";
      }

      if (instruction.arg) {
        x += instruction.arg;
      }
    }

    console.log(crt);
  });
});

async function* readInstructions() {
  for await (const line of InputFile.readLines(join(__dirname, "input.txt"))) {
    const v = line.split(" ");
    yield {
      op: v[0] as "addx" | "noop",
      arg: v[1] ? parseInt(v[1]) : 0,
    };
  }
}
