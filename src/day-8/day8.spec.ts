import * as fs from "fs";
import { join } from "path";
import { InputFile } from "../input";

describe("day 8", () => {
  it("part 1", async () => {
    const grid = await readGrid();

    const height = grid.length;
    const width = grid[0].length;

    let visibleCount = 0;

    function updateTree(
      tree: { height: number; visible: boolean },
      heighest: number
    ) {
      if (heighest < tree.height) {
        if (!tree.visible) {
          tree.visible = true;
          visibleCount++;
        }
        return tree.height;
      }
    }

    // left
    for (let h = 0; h < height; h++) {
      const line = grid[h];
      let heighest = -1;
      for (let w = 0; w < width; w++) {
        heighest = updateTree(line[w], heighest) ?? heighest;
      }
    }
    //right
    for (let h = 0; h < height; h++) {
      const line = grid[h];
      let heighest = -1;
      for (let w = width - 1; w >= 0; w--) {
        heighest = updateTree(line[w], heighest) ?? heighest;
      }
    }
    // top
    for (let w = 0; w < width; w++) {
      let heighest = -1;
      for (let h = 0; h < height; h++) {
        heighest = updateTree(grid[h][w], heighest) ?? heighest;
      }
    }
    //bottom
    for (let w = 0; w < width; w++) {
      let heighest = -1;
      for (let h = height - 1; h >= 0; h--) {
        heighest = updateTree(grid[h][w], heighest) ?? heighest;
      }
    }

    console.log(grid);
    console.log(visibleCount);
  });

  it("part 2", async () => {
    const grid = await readGrid();

    const height = grid.length;
    const width = grid[0].length;

    let highestScore = 0;

    for (let h = 0; h < height; h++) {
      const line = grid[h];
      for (let w = 0; w < width; w++) {
        const tree = line[w];

        // left
        let count = 0;
        for (let i = w - 1; i >= 0; i--) {
          count++;
          if (grid[h][i].height >= tree.height) {
            break;
          }
        }
        tree.l = count;
        // right
        count = 0;
        for (let i = w + 1; i < width; i++) {
          count++;
          if (grid[h][i].height >= tree.height) {
            break;
          }
        }
        tree.r = count;
        // up
        count = 0;
        for (let i = h - 1; i >= 0; i--) {
          count++;
          if (grid[i][w].height >= tree.height) {
            break;
          }
        }
        tree.t = count;
        // down
        count = 0;
        for (let i = h + 1; i < height; i++) {
          count++;
          if (grid[i][w].height >= tree.height) {
            break;
          }
        }
        tree.b = count;
        tree.ss = tree.b * tree.l * tree.r * tree.t;

        if (tree.ss > highestScore) {
          highestScore = tree.ss;
        }
      }
    }

    console.log(grid);
    console.log(highestScore);
  });
});

async function readGrid() {
  const grid = [];
  for await (const line of InputFile.readLines(join(__dirname, "input.txt"))) {
    grid.push(
      line.split("").map((h) => ({
        height: parseInt(h),
        visible: false,
        l: 0,
        t: 0,
        r: 0,
        b: 0,
        ss: 0,
      }))
    );
  }
  return grid;
}
