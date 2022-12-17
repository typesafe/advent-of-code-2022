import { join } from "path";
import { InputFile } from "../input";

describe("day 12", () => {
  it("part 1", async () => {
    const [start, end, charDim, elevMap] = await parseInput();
    let queue: [Node, number][] = [[start, 0]];
    const visited: Set<string> = new Set();

    while (queue.length) {
      const [currentPoint, steps] = queue.shift()!;
      if (visited.has(currentPoint.toString())) {
        continue;
      }
      visited.add(currentPoint.toString());

      if (currentPoint.toString() === end.toString()) {
        console.log(steps);
        break;
      }

      const neighbors: Node[] = getNeighbors(currentPoint, charDim);
      const possibleValues: Node[] = neighbors.filter(
        (point) =>
          elevMap[point[0]][point[1]] <=
          elevMap[currentPoint[0]][currentPoint[1]] + 1
      );
      queue = queue.concat(possibleValues.map((point) => [point, steps + 1]));
    }
  });

  it("part 2", async () => {
    const [start, end, charDim, elevMap] = await parseInput();
    let queue: [Node, number][] = [[end, 0]];
    const visited: Set<string> = new Set();

    while (queue.length) {
      const [currentPoint, steps] = queue.shift()!;
      if (visited.has(currentPoint.toString())) {
        continue;
      }
      visited.add(currentPoint.toString());
      if (elevMap[currentPoint[0]][currentPoint[1]] === 0) {
        console.log(steps);
        break;
      }
      const neighbors: Node[] = getNeighbors(currentPoint, charDim);
      const possibleValues: Node[] = neighbors.filter(
        (point) =>
          elevMap[point[0]][point[1]] >=
          elevMap[currentPoint[0]][currentPoint[1]] - 1
      );
      queue = queue.concat(possibleValues.map((point) => [point, steps + 1]));
    }
    return "Shortest path not found";
  });
});

async function readLines() {
  const map = [];
  for await (const line of InputFile.readLines(join(__dirname, "input.txt"))) {
    map.push(line);
  }
  return map;
}

function getNeighbors([x, y]: Node, chartDim: Node): Node[] {
  const offsets: Node[] = [
    [-1, 0],
    [1, 0],
    [0, 1],
    [0, -1],
  ];
  const points: Node[] = offsets.map(([dx, dy]) => [x + dx, y + dy]);

  return points.filter(
    (point) =>
      point.every((x) => x >= 0) &&
      point[0] < chartDim[0] &&
      point[1] < chartDim[1]
  );
}

async function parseInput(): Promise<[Node, Node, Node, ElevationMap]> {
  const input = await readLines();
  let start: Node = [0, 0];
  let end: Node = [0, 0];
  const w = input.length;
  const h = input[0].length;

  const elevMap: ElevationMap = Array(w)
    .fill(0)
    .map((_) => new Array(h));

  input.forEach((row, x) => {
    row.split("").forEach((square, y) => {
      if (square === "S") {
        start = [x, y];
        elevMap[x][y] = elevationsByChar.indexOf("a");
      } else if (square === "E") {
        end = [x, y];
        elevMap[x][y] = elevationsByChar.indexOf("z");
      } else {
        elevMap[x][y] = elevationsByChar.indexOf(square);
      }
    });
  });
  return [start, end, [w, h], elevMap];
}

const elevationsByChar: string[] = Array.from(Array(26))
  .map((_, i) => i + 97)
  .map((x) => String.fromCharCode(x));

type Node = [number, number];
type Map<T> = T[][];
type ElevationMap = Map<number>;
