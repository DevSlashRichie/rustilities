import toExtends from "@devslashrichie/global/jest.config";

export default {
  ...toExtends,
  testEnvironment: "jsdom",
  testTimeout: 30000,
  setupFilesAfterEnv: ["<rootDir>/jest-setup.ts"],
};
