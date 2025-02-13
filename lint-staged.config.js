/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */

export default {
  "*.ts": [() => "tsc --noEmit", "eslint", "prettier --write"],
};
