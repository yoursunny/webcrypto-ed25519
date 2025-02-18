/** @typedef {import("xo").Options} XoOptions */

/** @type {import("@yoursunny/xo-config")} */
const { js, ts, web, merge } = require("@yoursunny/xo-config");

/** @type {XoOptions} */
module.exports = {
  ...merge(js, web),
  overrides: [
    {
      files: [
        "*.ts",
      ],
      ...merge(js, ts, web, {
        rules: {
          "prefer-rest-params": "off",
        },
      }),
    },
  ],
};
