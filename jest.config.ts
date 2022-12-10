import type { Config } from "@jest/types";

export default async (): Promise<Config.InitialOptions> => {
  return {
    verbose: true,
    moduleFileExtensions: ["js", "json", "ts"],
    rootDir: ".",
    testRegex: "spec.ts$",
    testEnvironment: "node",
    transform: {
      "^.+\\.ts$": "ts-jest",
    },
    modulePathIgnorePatterns: ["<rootDir>/dist/"],
    transformIgnorePatterns: ["/node_modules/"],
  };
};
