import * as fs from "fs";
import { join } from "path";
import { InputFile } from "../input";

describe("day 5", () => {
  it("part 1", async () => {
    let buffer: string[] = [];
    let position = 0;

    for await (let char of InputFile.readChars(join(__dirname, "input.txt"))) {
      position++;
      const ix = buffer.indexOf(char);

      if (ix >= 0) {
        buffer = buffer.slice(ix + 1);
      }

      buffer.push(char);
      if (buffer.length == 4) {
        break;
      }
    }
    console.log(position);
  });

  it("part 2", async () => {
    let buffer: string[] = [];
    let position = 0;

    for await (let char of InputFile.readChars(join(__dirname, "input.txt"))) {
      position++;
      const ix = buffer.indexOf(char);

      if (ix >= 0) {
        buffer = buffer.slice(ix + 1);
      }

      buffer.push(char);
      if (buffer.length == 14) {
        break;
      }
    }
    console.log(position);
  });
});
