module.exports = {
    roots: ['<rootDir>/src'],
    transform: {
      '^.+\\.tsx$': 'ts-jest',
      '^.+\\.ts$': 'ts-jest',
      "^.+\\.js$": "babel-jest",
    },
    testRegex: '(src/.*\\.(test|spec))\\.tsx?$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    moduleNameMapper: {
        "\\.(css|scss)$": "identity-obj-proxy"
    },
    setupFiles: ["./src/setup-test.js"],
    globals: {
      "API": "{}"
    }
}