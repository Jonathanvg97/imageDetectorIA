import { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/test/**/*.test.ts"],
  reporters: [
    "default",
    [
      "jest-html-reporter",
      {
        pageTitle: "Resultados de Pruebas",
        outputPath: "reports/test-report.html",
        includeFailureMsg: true,
        includeConsoleLog: true,
      },
    ],
  ],
};

export default config;
