import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
    testEnvironment: "node",
    clearMocks: true,
    transform: {
        "^.+\\.(t|j)sx?$": "@swc/jest",
    },
    transformIgnorePatterns: [],
    testMatch: ["**/?(*.)+(spec|test).ts"],
    moduleFileExtensions: ["ts", "js", "json"],
};

export default config;