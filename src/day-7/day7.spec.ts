import * as fs from "fs";
import { join } from "path";
import { InputFile } from "../input";

describe("day 5", () => {
  it("part 1", async () => {
    const t = new Terminal();

    await t.replay();

    const sum = sumDirs(t.root, 0);

    console.dir(t.root, { depth: 10 });
    console.log(sum);
  });

  it("part 2", async () => {
    const t = new Terminal();

    await t.replay();

    const sum = sumDirs(t.root, 0);
    const availableSpace = 70_000_000 - t.root.size;
    const minimumToDelete = 30_000_000 - availableSpace;
    console.dir(smallestDirAbove(t.root, minimumToDelete));
    console.log(sum);
  });
});

function smallestDirAbove(dir: Dir, size: number) {
  let candidate = dir.size > size ? dir : null;

  for (const d of Object.values(dir.dirs)) {
    const sm = smallestDirAbove(d, size);
    if (sm) {
      if (!candidate || sm.size < candidate.size) {
        candidate = sm;
      }
    }
  }

  return candidate;
}

function sumDirs(dir: Dir, sum: number) {
  if (dir.size <= 100_000) {
    sum += dir.size;
  }

  for (const d of Object.values(dir.dirs)) {
    sum += sumDirs(d, 0);
  }

  return sum;
}

type Dir = {
  size: number;
  dirs: { [path: string]: Dir };
  files: { [name: string]: number };
  parent: Dir | null;
};

type Command = {
  name: string;
  arg: string | undefined;
  output: string[];
};

class Terminal {
  generator = InputFile.readLines(join(__dirname, "input.txt"));
  root: Dir = {
    size: 0,
    dirs: {} as { [path: string]: Dir },
    files: {},
    parent: null,
  };

  cwd = this.root;

  async replay() {
    for await (const command of this.getCommands()) {
      switch (command.name) {
        case "ls":
          this.ls(command);
          break;
        case "cd":
          this.cd(command);
          break;
        default:
          throw new Error("unkown command");
      }
    }
  }

  async *getCommands() {
    let command: Command | null = null;

    for await (const line of this.generator) {
      if (line[0] == "$") {
        if (command) {
          yield command;
        }
        const [_, name, arg] = line.split(" ");
        command = { name, arg, output: [] };
      } else {
        command?.output.push(line);
      }
    }

    if (command) {
      yield command;
    }
  }

  async ls(command: Command) {
    for (const item of command.output) {
      const [dirOrSize, name] = item.split(" ");
      if (dirOrSize != "dir") {
        const size = parseInt(dirOrSize);
        this.cwd.files[name] = size;
        let d: Dir | null = this.cwd;
        while (d) {
          d.size += size;
          d = d.parent;
        }
      }
    }
  }

  async cd(command: Command) {
    if (command.arg == "/") {
      this.cwd = this.root;
    } else if (command.arg == "..") {
      this.cwd = this.cwd.parent ?? this.root;
    } else {
      this.cwd.dirs[command.arg!] = this.cwd.dirs[command.arg!] ?? {
        dirs: {},
        files: {},
        parent: this.cwd,
        size: 0,
      };
      this.cwd = this.cwd.dirs[command.arg!];
    }
  }
}
