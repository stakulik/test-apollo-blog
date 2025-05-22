module.exports = {
  "exit": true,
  "file": "test/setup.ts",
  "recursive": true,
  "require": "ts-node/register",
  "spec": [
    "test/**/*.test.ts",
  ],
  "timeout": 10000,
};
