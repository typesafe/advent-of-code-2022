import { join } from "path";
import { InputFile } from "../input";

describe("day 14", () => {
  it("part 1", async () => {
    let offset = [Infinity, Infinity];
    let maxHeight = 0;
    for await (const path of readInstructions()) {
      for (const point of path) {
        if (point[0] < offset[0]) {
          offset[0] = point[0];
        }
        if (point[1] < offset[1]) {
          offset[1] = point[1];
        }

        if (point[1] > maxHeight) {
          maxHeight = point[1];
        }
      }
    }
    offset[1] = 0;

    const rows = maxHeight - offset[1];
    const scan: string[][] = [];

    for (let i = 0; i <= rows; i++) {
      scan[i] = [];
    }
    const sandSource = [500 - offset[0], 0];

    for await (const path of readInstructions()) {
      let src = path[0];
      scan[src[1] - offset[1]][src[0] - offset[0]] = "#";

      for (const point of path.slice(1)) {
        if (point[0] != src[0]) {
          const min = Math.min(point[0], src[0]);
          const max = Math.max(point[0], src[0]);
          for (let x = min; x <= max; x++) {
            scan[point[1] - offset[1]][x - offset[0]] = "#";
          }
        } else {
          const min = Math.min(point[1], src[1]);
          const max = Math.max(point[1], src[1]);
          for (let y = min; y <= max; y++) {
            scan[y - offset[1]][point[0] - offset[0]] = "#";
          }
        }
        src = point;
      }
    }

    let x = 500 - offset[0];
    let grains = 0;
    while (true) {
      if (x < 0) {
        break;
      }
      grains++;
      x = 500 - offset[0];

      for (let y = 0; y < scan.length; y++) {
        if (x < 0) {
          break;
        }

        const line = scan[y];
        const nextLine = scan[y + 1];
        if (!nextLine) {
          x = -1;
          break;
        }
        // if (nextLine[x] == "#") {
        //   line[x] = "o";
        //   break;
        // }

        if (nextLine[x] == "o" || nextLine[x] == "#") {
          if (nextLine[x - 1] == undefined) {
            x--;
            continue;
          } else if (nextLine[x + 1] == undefined) {
            x++;
            continue;
          } else {
            line[x] = "o";
            break;
          }
        }
      }
    }

    console.log(grains - 1);
  });

  it("part 2", async () => {
    let offset = [0, 0];
    let maxHeight = 0;
    for await (const path of readInstructions()) {
      for (const point of path) {
        if (point[1] > maxHeight) {
          maxHeight = point[1];
        }
      }
    }

    const rows = maxHeight - offset[1];
    const scan: string[][] = [];

    for (let i = 0; i <= rows; i++) {
      scan[i] = [];
    }

    scan.push([]);

    const sandSource = [500 - offset[0], 0];

    for await (const path of readInstructions()) {
      let src = path[0];
      scan[src[1] - offset[1]][src[0] - offset[0]] = "#";

      for (const point of path.slice(1)) {
        if (point[0] != src[0]) {
          const min = Math.min(point[0], src[0]);
          const max = Math.max(point[0], src[0]);
          for (let x = min; x <= max; x++) {
            scan[point[1] - offset[1]][x - offset[0]] = "#";
          }
        } else {
          const min = Math.min(point[1], src[1]);
          const max = Math.max(point[1], src[1]);
          for (let y = min; y <= max; y++) {
            scan[y - offset[1]][point[0] - offset[0]] = "#";
          }
        }
        src = point;
      }
    }

    let x = 500 - offset[0];
    let grains = 0;
    while (true) {
      if (x < 0) {
        break;
      }
      grains++;
      x = 500 - offset[0];

      for (let y = 0; y < scan.length; y++) {
        if (x < 0) {
          break;
        }

        const line = scan[y];
        const nextLine = scan[y + 1];
        if (!nextLine) {
          line[x] = "o";
          break;
        }
        // if (nextLine[x] == "#") {
        //   line[x] = "o";
        //   break;
        // }

        if (nextLine[x] == "o" || nextLine[x] == "#") {
          if (nextLine[x - 1] == undefined) {
            x--;
            continue;
          } else if (nextLine[x + 1] == undefined) {
            x++;
            continue;
          } else {
            if (x == 500 && y == 0) {
              x = -1;
              break;
            }
            line[x] = "o";
            break;
          }
        }
      }
    }

    console.log(grains);
  });
});

async function* readInstructions() {
  for await (const line of InputFile.readLines(join(__dirname, "input.txt"))) {
    if (!line) {
      continue;
    }

    const path = line.split(" -> ");

    yield path.map(
      (c) => c.split(",").map((v) => parseInt(v)) as [number, number]
    );
  }
}
