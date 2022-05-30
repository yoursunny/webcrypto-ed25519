const path = require("node:path");

/** @type {import("webpack").Configuration} */
module.exports = {
  mode: "production",
  devtool: "source-map",
  entry: "./test/web.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "test"),
  },
  node: false,
};
