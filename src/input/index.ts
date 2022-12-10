import * as fs from "fs";

export class InputFile {
  static async *readLines(path: string) {
    const s = fs.createReadStream(path, { encoding: "utf-8" });
    let buffer = "";

    for await (const chunk of s) {
      buffer += chunk;
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        yield line;
      }
    }
    s.close();

    if (buffer) {
      yield buffer;
    }
  }

  static async *readChars(path: string) {
    const s = fs.createReadStream(path, { encoding: "utf-8" });

    for await (const chunk of s) {
      for (const char of chunk) {
        yield char;
      }
    }
    s.close();
  }
}
