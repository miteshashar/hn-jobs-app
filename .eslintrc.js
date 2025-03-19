// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ["expo", "prettier"],
  plugins: ["prettier", "jest"],
  rules: {
    "prettier/prettier": ["error"],
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/prefer-to-have-length": "warn",
    "jest/valid-expect": "error",
  },
  env: {
    "jest/globals": true,
  },
  ignorePatterns: ["/dist/*", "node_modules/*"],
};
