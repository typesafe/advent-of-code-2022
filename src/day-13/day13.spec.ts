import { join } from "path";
import { InputFile } from "../input";

describe("day 13", () => {
  it("part 1", async () => {
    let index = 0;
    let tot = 0;
    for await (const pair of getPacketPairs()) {
      index++;
      if (compare(pair[0], pair[1], true) == -1) {
        tot += index;
      }
    }

    console.log(tot);
  });
  it("part 2", async () => {
    const sorted = (await getAllPackets()).sort((a, b) => compare(a, b, true));

    // use output to get numbers
    console.log(sorted.map((v, i) => `${i}: ${JSON.stringify(v)}`).join("\n"));
  });
});

function compare(
  left: (number | number[])[],
  right: (number | number[])[],
  root = false
): 1 | -1 | 0 {
  let lcursor = 0;
  let rcursor = 0;

  while (true) {
    let l = left[lcursor];
    let r = right[rcursor];

    if (l === undefined && r !== undefined) {
      return -1;
    }

    if (l === undefined && r === undefined) {
      return root ? -1 : 0;
    }

    if (l !== undefined && r === undefined) {
      return 1;
    }

    if (Array.isArray(l)) {
      if (Array.isArray(r)) {
        const res = compare(l, r);
        if (res === 0) {
          lcursor++;
          rcursor++;
          continue;
        } else {
          return res;
        }
      } else {
        const res = compare(l, [r]);
        if (res === 0) {
          lcursor++;
          rcursor++;
          continue;
        } else {
          return res;
        }
      }
    } else {
      if (Array.isArray(r)) {
        const res = compare([l], r);
        if (res === 0) {
          lcursor++;
          rcursor++;
          continue;
        } else {
          return res;
        }
      } else {
        if (l > r) {
          return 1;
        } else if (l == r) {
          lcursor++;
          rcursor++;
          continue;
        }
        return -1;
      }
    }
  }
}

async function* getPacketPairs() {
  let pair: (number | number[])[][] = [];
  for await (const line of InputFile.readLines(join(__dirname, "input.txt"))) {
    if (!line) {
      continue;
    }
    pair.push(eval(line));

    if (pair.length == 2) {
      yield pair;
      pair = [];
    }
  }
}

async function getAllPackets() {
  const res = [[[2]], [[6]]];

  for await (const line of InputFile.readLines(join(__dirname, "input.txt"))) {
    if (!line) {
      continue;
    }
    res.push(eval(line));
  }
  return res;
}
